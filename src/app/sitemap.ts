import type { MetadataRoute } from "next";
import { getAllCategories, getAllPlants } from "@/lib/catalog";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [plants, categories] = await Promise.all([getAllPlants(), getAllCategories()]);
  const now = new Date();
  const staticRoutes = ["", "/shop", "/categories", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${site.url}/categories/${c.slug}`, lastModified: now, priority: 0.7 })),
    ...plants.map((p) => ({ url: `${site.url}/plants/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
