"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MAX_DISCOUNT, SALE_SLUG } from "@/lib/format";
import { requireAdmin } from "@/lib/server/auth";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  adminConfigured,
  createSessionToken,
  passwordMatches,
} from "@/lib/server/session";
import { StoreConflictError, store } from "@/lib/server/store";
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
  discountPercent: z.coerce
    .number()
    .int("Whole numbers only")
    .min(0, "Can't be negative")
    .max(MAX_DISCOUNT, `At most ${MAX_DISCOUNT}%`)
    .default(0),
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
  slug: slug.refine((s) => s !== SALE_SLUG, "“sale” is reserved for the automatic Sale category"),
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

/** Turns storage conflicts into the same friendly errors the forms already show. */
function conflictResult(err: unknown, what: "plant" | "category"): ActionResult {
  if (err instanceof StoreConflictError) {
    if (err.kind === "slug-taken") {
      return { ok: false, error: `Another ${what} already uses this URL slug.`, fields: { slug: "Already in use" } };
    }
    if (err.kind === "category-missing") {
      return { ok: false, error: "Choose a valid category.", fields: { category: "Unknown category" } };
    }
    return { ok: false, error: "This category still has plants. Move or delete them first." };
  }
  console.error(err);
  return { ok: false, error: "Couldn't save right now. Please try again in a moment." };
}

/* -------------------------------------------------------------- plants */

export async function savePlant(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = plantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) };
  const { id, ...rest } = parsed.data;

  // Friendly pre-checks; the store/database enforces the same rules as a backstop.
  const cat = await store().read();
  if (!cat.categories.some((c) => c.slug === rest.category)) {
    return { ok: false, error: "Choose a valid category.", fields: { category: "Unknown category" } };
  }
  if (cat.plants.some((p) => p.slug === rest.slug && p.id !== id)) {
    return { ok: false, error: "Another plant already uses this URL slug.", fields: { slug: "Already in use" } };
  }

  try {
    if (id) {
      const found = await store().updatePlant({ ...rest, id } as Plant);
      if (!found) return { ok: false, error: "This plant no longer exists." };
      refreshSite();
      return { ok: true, id };
    }
    const newId = `p-${Date.now().toString(36)}${randomBytes(2).toString("hex")}`;
    await store().insertPlant({ ...rest, id: newId } as Plant);
    refreshSite();
    return { ok: true, id: newId };
  } catch (err) {
    return conflictResult(err, "plant");
  }
}

export async function deletePlant(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    if (!(await store().deletePlant(id))) return { ok: false, error: "Plant not found." };
    refreshSite();
    return { ok: true };
  } catch (err) {
    return conflictResult(err, "plant");
  }
}

/* ---------------------------------------------------------- categories */

export async function saveCategory(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) };
  const { originalSlug, ...data } = parsed.data;

  const cat = await store().read();
  if (cat.categories.some((c) => c.slug === data.slug && c.slug !== originalSlug)) {
    return { ok: false, error: "Another category already uses this URL slug.", fields: { slug: "Already in use" } };
  }

  try {
    if (originalSlug) {
      // Plants move with a slug change (handled by the store / ON UPDATE CASCADE).
      const found = await store().updateCategory(originalSlug, data as Category);
      if (!found) return { ok: false, error: "This category no longer exists." };
    } else {
      await store().insertCategory(data as Category);
    }
    refreshSite();
    return { ok: true, id: data.slug };
  } catch (err) {
    return conflictResult(err, "category");
  }
}

export async function deleteCategory(categorySlug: string): Promise<ActionResult> {
  await requireAdmin();
  const cat = await store().read();
  const inUse = cat.plants.filter((p) => p.category === categorySlug).length;
  if (inUse > 0) {
    return {
      ok: false,
      error: `This category still has ${inUse} plant${inUse === 1 ? "" : "s"}. Move or delete them first.`,
    };
  }
  try {
    if (!(await store().deleteCategory(categorySlug))) return { ok: false, error: "Category not found." };
    refreshSite();
    return { ok: true };
  } catch (err) {
    return conflictResult(err, "category");
  }
}

/* -------------------------------------------------------------- uploads */

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" } as const;

/** Detects the real image type from its first bytes (don't trust the browser's MIME). */
function sniffImage(buf: Buffer): keyof typeof MIME | null {
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
  try {
    return { ok: true, url: await store().saveImage(name, buf, MIME[ext]) };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
