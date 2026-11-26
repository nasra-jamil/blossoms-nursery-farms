import type { Category, Plant } from "@/data/types";

export interface CatalogData {
  plants: Plant[];
  categories: Category[];
}

/** A constraint the database (or file store) refused. Actions turn these into form errors. */
export class StoreConflictError extends Error {
  constructor(public kind: "slug-taken" | "category-in-use" | "category-missing") {
    super(kind);
    this.name = "StoreConflictError";
  }
}

/**
 * Storage backend for the catalogue. Implementations: local JSON file
 * (`file.ts`) and Supabase (`supabase.ts`). Update/delete return `false`
 * when the record no longer exists.
 */
export interface CatalogStore {
  kind: "file" | "supabase";
  read(): Promise<CatalogData>;
  insertPlant(plant: Plant): Promise<void>;
  updatePlant(plant: Plant): Promise<boolean>;
  deletePlant(id: string): Promise<boolean>;
  insertCategory(category: Category): Promise<void>;
  updateCategory(originalSlug: string, category: Category): Promise<boolean>;
  deleteCategory(slug: string): Promise<boolean>;
  /** Stores an uploaded image and returns the URL to use in the catalogue. */
  saveImage(fileName: string, data: Buffer, contentType: string): Promise<string>;
}
