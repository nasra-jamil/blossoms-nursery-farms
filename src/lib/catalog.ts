/**
 * Data-access layer. Pages only talk to these async functions, so swapping the
 * static sample data for a CMS (Sanity, Contentful) or database later only
 * requires changing this file.
 */
import { plants } from "@/data/plants";
import { categories } from "@/data/categories";
import { testimonials } from "@/data/testimonials";
import type { CategorySlug } from "@/data/types";

export async function getAllPlants() {
  return plants;
}

export async function getFeaturedPlants(limit = 8) {
  return plants.filter((p) => p.featured).slice(0, limit);
}

export async function getPlantBySlug(slug: string) {
  return plants.find((p) => p.slug === slug) ?? null;
}

export async function getPlantsByCategory(slug: CategorySlug) {
  return plants.filter((p) => p.category === slug);
}

export async function getRelatedPlants(slug: string, limit = 4) {
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
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export { categoryName as getCategoryName } from "@/data/categories";

export async function getCategoryCounts() {
  return Object.fromEntries(
    categories.map((c) => [c.slug, plants.filter((p) => p.category === c.slug).length]),
  ) as Record<CategorySlug, number>;
}

export async function getTestimonials() {
  return testimonials;
}
