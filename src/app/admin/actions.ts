"use server";

import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/auth";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminConfigured,
  createSessionToken,
  passwordMatches,
} from "@/lib/server/session";
import { UPLOAD_DIR, updateCatalog } from "@/lib/server/store";
import type { Category, Plant } from "@/data/types";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string; fields?: Record<string, string> };

/* ------------------------------------------------------------------ auth */

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  if (!adminConfigured()) return { error: "Admin login is disabled: set ADMIN_PASSWORD in .env.local and restart the server." };
  const password = String(formData.get("password") ?? "");
  if (!(await passwordMatches(password))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "Incorrect password." };
  }
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------------------------------------------------------- validation */

const slug = z
  .string()
  .trim()
  .min(2, "At least 2 characters")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and single hyphens only");

const imageSrc = z
  .string()
  .trim()
  .refine((v) => /^https:\/\/[^\s]+$/.test(v) || /^\/uploads\/[a-f0-9]{24}\.(jpg|png|webp|avif)$/.test(v), {
    message: "Use an https:// image URL or upload a file",
  });

const image = z.object({ src: imageSrc, alt: z.string().trim().min(3, "Describe the image").max(200) });

const text = (max: number, min = 1) => z.string().trim().min(min, "Required").max(max);

const plantSchema = z.object({
  id: z.string().optional(),
  name: text(80, 2),
  slug,
  botanicalName: z.string().trim().max(120).default(""),
  category: slug,
  price: z.coerce.number().int("Whole rupees only").min(0).max(10_000_000),
  description: text(200, 10),
  details: text(2000, 10),
  images: z.array(image).min(1, "Add at least one image").max(8),
  availability: z.enum(["in-stock", "low-stock", "out-of-stock"]),
  sunlight: text(120),
  watering: text(120),
  maintenance: z.enum(["Easy", "Moderate", "Expert"]),
  size: text(120),
  placement: z.array(z.enum(["Indoor", "Balcony", "Outdoor"])).min(1, "Pick at least one"),
  care: z.array(z.string().trim().min(1).max(300)).max(12),
  featured: z.boolean().default(false),
});

const categorySchema = z.object({
  originalSlug: z.string().optional(),
  name: text(60, 2),
  slug,
  description: text(200, 10),
  image,
});

function fieldErrors(err: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

/* -------------------------------------------------------------- plants */

export async function savePlant(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = plantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) };
  const data = parsed.data;

  return updateCatalog((cat): ActionResult => {
    if (!cat.categories.some((c) => c.slug === data.category)) {
      return { ok: false, error: "Choose a valid category.", fields: { category: "Unknown category" } };
    }
    if (cat.plants.some((p) => p.slug === data.slug && p.id !== data.id)) {
      return { ok: false, error: "Another plant already uses this URL slug.", fields: { slug: "Already in use" } };
    }
    const { id, ...rest } = data;
    if (id) {
      const idx = cat.plants.findIndex((p) => p.id === id);
      if (idx === -1) return { ok: false, error: "This plant no longer exists." };
      cat.plants[idx] = { ...cat.plants[idx], ...rest, id } as Plant;
      refreshSite();
      return { ok: true, id };
    }
    const newId = `p-${Date.now().toString(36)}${randomBytes(2).toString("hex")}`;
    cat.plants.unshift({ ...rest, id: newId } as Plant);
    refreshSite();
    return { ok: true, id: newId };
  });
}

export async function deletePlant(id: string): Promise<ActionResult> {
  await requireAdmin();
  return updateCatalog((cat): ActionResult => {
    const before = cat.plants.length;
    cat.plants = cat.plants.filter((p) => p.id !== id);
    if (cat.plants.length === before) return { ok: false, error: "Plant not found." };
    refreshSite();
    return { ok: true };
  });
}

/* ---------------------------------------------------------- categories */

export async function saveCategory(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) };
  const { originalSlug, ...data } = parsed.data;

  return updateCatalog((cat): ActionResult => {
    if (cat.categories.some((c) => c.slug === data.slug && c.slug !== originalSlug)) {
      return { ok: false, error: "Another category already uses this URL slug.", fields: { slug: "Already in use" } };
    }
    if (originalSlug) {
      const idx = cat.categories.findIndex((c) => c.slug === originalSlug);
      if (idx === -1) return { ok: false, error: "This category no longer exists." };
      cat.categories[idx] = data as Category;
      // Keep plants attached when the slug changes.
      if (originalSlug !== data.slug) {
        for (const p of cat.plants) if (p.category === originalSlug) p.category = data.slug;
      }
    } else {
      cat.categories.push(data as Category);
    }
    refreshSite();
    return { ok: true, id: data.slug };
  });
}

export async function deleteCategory(categorySlug: string): Promise<ActionResult> {
  await requireAdmin();
  return updateCatalog((cat): ActionResult => {
    const inUse = cat.plants.filter((p) => p.category === categorySlug).length;
    if (inUse > 0) {
      return {
        ok: false,
        error: `This category still has ${inUse} plant${inUse === 1 ? "" : "s"}. Move or delete them first.`,
      };
    }
    const before = cat.categories.length;
    cat.categories = cat.categories.filter((c) => c.slug !== categorySlug);
    if (cat.categories.length === before) return { ok: false, error: "Category not found." };
    refreshSite();
    return { ok: true };
  });
}

/* -------------------------------------------------------------- uploads */

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Detects the real image type from its first bytes (don't trust the browser's MIME). */
function sniffImage(buf: Buffer): "jpg" | "png" | "webp" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buf.toString("ascii", 4, 8) === "ftyp" && /^avi[fs]/.test(buf.toString("ascii", 8, 12))) return "avif";
  return null;
}

export async function uploadImage(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image file." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "Image must be 5 MB or smaller." };
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(buf);
  if (!ext) return { ok: false, error: "Only JPG, PNG, WebP or AVIF images are allowed." };
  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return { ok: true, url: `/uploads/${name}` };
}
