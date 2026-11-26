import "server-only";
import { fileStore } from "./file";
import { supabaseStore } from "./supabase";
import type { CatalogStore } from "./types";

export { StoreConflictError, type CatalogData, type CatalogStore } from "./types";
export { UPLOAD_DIR } from "./file";

/** True when Supabase credentials are present in the environment. */
export const usingSupabase = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * The active catalogue backend: Supabase when configured, otherwise the local
 * JSON file (handy for development before Supabase keys are added).
 */
export function store(): CatalogStore {
  return usingSupabase() ? supabaseStore : fileStore;
}

export const readCatalog = () => store().read();
