import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Plant } from "@/data/types";
import { plants as seedPlants } from "@/data/plants";
import { categories as seedCategories } from "@/data/categories";
import { StoreConflictError, type CatalogData, type CatalogStore } from "./types";

/**
 * Local JSON-file backend, used when Supabase isn't configured (e.g. local
 * development). Data lives in `data/catalog.json`, uploads in `data/uploads/`.
 * Needs a persistent, writable disk — not suitable for Vercel.
 */

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");

function stripDerived(plants: Plant[]): Plant[] {
  return plants.map((p) => {
    const copy = { ...p };
    delete copy.categoryName;
    return copy;
  });
}

async function writeFileAtomic(data: CatalogData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${CATALOG_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2), "utf8");
  await fs.rename(tmp, CATALOG_FILE);
}

async function read(): Promise<CatalogData> {
  try {
    const { plants, categories } = JSON.parse(await fs.readFile(CATALOG_FILE, "utf8")) as CatalogData;
    return { plants, categories };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const data = { plants: stripDerived(seedPlants), categories: seedCategories };
    await writeFileAtomic(data);
    return data;
  }
}

/** Serialises writes within this process so concurrent admin saves can't clobber each other. */
let queue: Promise<unknown> = Promise.resolve();

function mutate<T>(fn: (data: CatalogData) => T): Promise<T> {
  const run = queue.then(async () => {
    const data = await read();
    const result = fn(data);
    data.plants = stripDerived(data.plants);
    await writeFileAtomic(data);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export const fileStore: CatalogStore = {
  kind: "file",
  read,

  insertPlant: (plant) =>
    mutate((d) => {
      if (d.plants.some((p) => p.slug === plant.slug)) throw new StoreConflictError("slug-taken");
      if (!d.categories.some((c) => c.slug === plant.category)) throw new StoreConflictError("category-missing");
      d.plants.unshift(plant);
    }),

  updatePlant: (plant) =>
    mutate((d) => {
      const idx = d.plants.findIndex((p) => p.id === plant.id);
      if (idx === -1) return false;
      if (d.plants.some((p) => p.slug === plant.slug && p.id !== plant.id)) throw new StoreConflictError("slug-taken");
      if (!d.categories.some((c) => c.slug === plant.category)) throw new StoreConflictError("category-missing");
      d.plants[idx] = plant;
      return true;
    }),

  deletePlant: (id) =>
    mutate((d) => {
      const before = d.plants.length;
      d.plants = d.plants.filter((p) => p.id !== id);
      return d.plants.length !== before;
    }),

  insertCategory: (category) =>
    mutate((d) => {
      if (d.categories.some((c) => c.slug === category.slug)) throw new StoreConflictError("slug-taken");
      d.categories.push(category);
    }),

  updateCategory: (originalSlug, category) =>
    mutate((d) => {
      const idx = d.categories.findIndex((c) => c.slug === originalSlug);
      if (idx === -1) return false;
      if (category.slug !== originalSlug && d.categories.some((c) => c.slug === category.slug)) {
        throw new StoreConflictError("slug-taken");
      }
      d.categories[idx] = category;
      if (category.slug !== originalSlug) {
        for (const p of d.plants) if (p.category === originalSlug) p.category = category.slug;
      }
      return true;
    }),

  deleteCategory: (slug) =>
    mutate((d) => {
      if (d.plants.some((p) => p.category === slug)) throw new StoreConflictError("category-in-use");
      const before = d.categories.length;
      d.categories = d.categories.filter((c) => c.slug !== slug);
      return d.categories.length !== before;
    }),

  async saveImage(fileName, data) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, fileName), data);
    return `/uploads/${fileName}`;
  },
};
