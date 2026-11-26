import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Category, Plant } from "@/data/types";
import { plants as seedPlants } from "@/data/plants";
import { categories as seedCategories } from "@/data/categories";

/**
 * File-backed catalogue store.
 *
 * Plants and categories live in `data/catalog.json` (created from the sample
 * data in `src/data` on first run). Admin uploads live in `data/uploads/`.
 *
 * This works on any host with a persistent disk (VPS, Docker volume, Render
 * disk, etc.). Serverless hosts such as Vercel do NOT persist file writes —
 * there, replace the read/write functions below with a database adapter
 * (Postgres, Supabase, MongoDB…). Nothing else needs to change.
 */

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");

export interface CatalogData {
  plants: Plant[];
  categories: Category[];
  updatedAt: string;
}

function stripDerived(plants: Plant[]): Plant[] {
  return plants.map((p) => {
    const copy = { ...p };
    delete copy.categoryName;
    return copy;
  });
}

async function seed(): Promise<CatalogData> {
  const data: CatalogData = {
    plants: stripDerived(seedPlants),
    categories: seedCategories,
    updatedAt: new Date().toISOString(),
  };
  await writeFileAtomic(data);
  return data;
}

async function writeFileAtomic(data: CatalogData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${CATALOG_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, CATALOG_FILE);
}

export async function readCatalog(): Promise<CatalogData> {
  try {
    const raw = await fs.readFile(CATALOG_FILE, "utf8");
    return JSON.parse(raw) as CatalogData;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return seed();
    throw err;
  }
}

/** Serialises writes within this process so concurrent admin saves can't clobber each other. */
let queue: Promise<unknown> = Promise.resolve();

export function updateCatalog<T>(mutate: (data: CatalogData) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const data = await readCatalog();
    const result = await mutate(data);
    data.plants = stripDerived(data.plants);
    data.updatedAt = new Date().toISOString();
    await writeFileAtomic(data);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}
