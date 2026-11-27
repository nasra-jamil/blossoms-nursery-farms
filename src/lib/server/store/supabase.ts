import "server-only";
import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Availability, Category, Maintenance, Placement, Plant, PlantImage } from "@/data/types";
import { StoreConflictError, type CatalogStore } from "./types";

/**
 * Supabase backend. Tables and the `plant-images` bucket are created by
 * `supabase/schema.sql`. Uses the secret (service_role) key, server-side only;
 * Row Level Security blocks every other key.
 */

export const IMAGE_BUCKET = "plant-images";

type PlantRow = {
  id: string;
  slug: string;
  name: string;
  botanical_name: string;
  category: string;
  price: number;
  discount_percent?: number;
  description: string;
  details: string;
  images: PlantImage[];
  availability: Availability;
  sunlight: string;
  watering: string;
  maintenance: Maintenance;
  size: string;
  placement: Placement[];
  care: string[];
  featured: boolean;
  sort_order?: number;
};

type CategoryRow = { slug: string; name: string; description: string; image: PlantImage; sort_order?: number };

const toPlant = (r: PlantRow): Plant => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  botanicalName: r.botanical_name,
  category: r.category,
  price: r.price,
  discountPercent: r.discount_percent ?? 0,
  description: r.description,
  details: r.details,
  images: r.images ?? [],
  availability: r.availability,
  sunlight: r.sunlight,
  watering: r.watering,
  maintenance: r.maintenance,
  size: r.size,
  placement: r.placement ?? [],
  care: r.care ?? [],
  featured: r.featured,
});

const toPlantRow = (p: Plant): PlantRow => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  botanical_name: p.botanicalName ?? "",
  category: p.category,
  price: p.price,
  discount_percent: p.discountPercent ?? 0,
  description: p.description,
  details: p.details,
  images: p.images,
  availability: p.availability,
  sunlight: p.sunlight,
  watering: p.watering,
  maintenance: p.maintenance,
  size: p.size,
  placement: p.placement,
  care: p.care,
  featured: Boolean(p.featured),
});

const toCategory = (r: CategoryRow): Category => ({ slug: r.slug, name: r.name, description: r.description, image: r.image });
const toCategoryRow = (c: Category): CategoryRow => ({ slug: c.slug, name: c.name, description: c.description, image: c.image });

let client: SupabaseClient | null = null;
function db() {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

/** Maps Postgres constraint errors to friendly conflicts; rethrows anything else. */
function check(error: PostgrestError | null, onForeignKey: "category-in-use" | "category-missing" = "category-missing") {
  if (!error) return;
  if (error.code === "23505") throw new StoreConflictError("slug-taken");
  if (error.code === "23503") throw new StoreConflictError(onForeignKey);
  throw new Error(`Supabase: ${error.message}`);
}

async function nextSortOrder(table: "plants" | "categories", direction: "first" | "last") {
  const { data, error } = await db()
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: direction === "first" })
    .limit(1);
  check(error);
  const current = (data?.[0] as { sort_order?: number } | undefined)?.sort_order ?? 0;
  return direction === "first" ? current - 1 : current + 1;
}

export const supabaseStore: CatalogStore = {
  kind: "supabase",

  async read() {
    const [plants, categories] = await Promise.all([
      db().from("plants").select("*").order("sort_order").order("created_at"),
      db().from("categories").select("*").order("sort_order").order("created_at"),
    ]);
    check(plants.error);
    check(categories.error);
    return {
      plants: (plants.data as PlantRow[]).map(toPlant),
      categories: (categories.data as CategoryRow[]).map(toCategory),
    };
  },

  async insertPlant(plant) {
    const sort_order = await nextSortOrder("plants", "first"); // new plants appear first
    const { error } = await db().from("plants").insert({ ...toPlantRow(plant), sort_order });
    check(error);
  },

  async updatePlant(plant) {
    const { data, error } = await db().from("plants").update(toPlantRow(plant)).eq("id", plant.id).select("id");
    check(error);
    return (data?.length ?? 0) > 0;
  },

  async deletePlant(id) {
    const { data, error } = await db().from("plants").delete().eq("id", id).select("id");
    check(error);
    return (data?.length ?? 0) > 0;
  },

  async insertCategory(category) {
    const sort_order = await nextSortOrder("categories", "last");
    const { error } = await db().from("categories").insert({ ...toCategoryRow(category), sort_order });
    check(error);
  },

  async updateCategory(originalSlug, category) {
    // Plants follow a slug change via ON UPDATE CASCADE.
    const { data, error } = await db().from("categories").update(toCategoryRow(category)).eq("slug", originalSlug).select("slug");
    check(error);
    return (data?.length ?? 0) > 0;
  },

  async deleteCategory(slug) {
    const { data, error } = await db().from("categories").delete().eq("slug", slug).select("slug");
    check(error, "category-in-use");
    return (data?.length ?? 0) > 0;
  },

  async saveImage(fileName, data, contentType) {
    const { error } = await db().storage.from(IMAGE_BUCKET).upload(fileName, data, { contentType, upsert: false });
    if (error) throw new Error(`Supabase storage: ${error.message}`);
    return db().storage.from(IMAGE_BUCKET).getPublicUrl(fileName).data.publicUrl;
  },
};
