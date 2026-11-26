/**
 * Data-access layer. Pages only talk to these async functions; storage lives in
 * `src/lib/server/store/` (Supabase when configured, otherwise a local JSON file).
 */
import "server-only";
import type { Category, Plant } from "@/data/types";
import { testimonials } from "@/data/testimonials";
import { readCatalog } from "./server/store";

function withCategoryNames(plants: Plant[], categories: Category[]): Plant[] {
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  return plants.map((p) => ({ ...p, categoryName: names.get(p.category) ?? p.category }));
}

async function load() {
  const { plants, categories } = await readCatalog();
  return { plants: withCategoryNames(plants, categories), categories };
}

export async function getAllPlants() {
  return (await load()).plants;
}

export async function getFeaturedPlants(limit = 8) {
  return (await getAllPlants()).filter((p) => p.featured).slice(0, limit);
}

export async function getPlantBySlug(slug: string) {
  return (await getAllPlants()).find((p) => p.slug === slug) ?? null;
}

export async function getPlantById(id: string) {
  return (await getAllPlants()).find((p) => p.id === id) ?? null;
}

export async function getPlantsByCategory(slug: string) {
  return (await getAllPlants()).filter((p) => p.category === slug);
}

export async function getRelatedPlants(slug: string, limit = 4) {
  const plants = await getAllPlants();
  const plant = plants.find((p) => p.slug === slug);
  if (!plant) return [];
  const sameCategory = plants.filter((p) => p.slug !== slug && p.category === plant.category);
  const samePlacement = plants.filter(
    (p) =>
      p.slug !== slug &&
      p.category !== plant.category &&
      p.placement.some((pl) => plant.placement.includes(pl)),
  );
  return [...sameCategory, ...samePlacement].slice(0, limit);
}

export async function getAllCategories() {
  return (await load()).categories;
}

export async function getCategoryBySlug(slug: string) {
  return (await getAllCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getCategoryCounts() {
  const { plants, categories } = await load();
  return Object.fromEntries(
    categories.map((c) => [c.slug, plants.filter((p) => p.category === c.slug).length]),
  ) as Record<string, number>;
}

export async function getTestimonials() {
  return testimonials;
}
