"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import type { Availability, Category, Maintenance, Placement, Plant, PlantImage } from "@/data/types";
import { savePlant } from "@/app/admin/actions";
import { cn, finalPrice, formatPrice, MAX_DISCOUNT } from "@/lib/format";
import { ImageField } from "./ImageField";
import { Card, Field, inputClass, slugify, textareaClass } from "./ui";

type FormState = Omit<Plant, "id" | "categoryName" | "price" | "discountPercent" | "care"> & {
  price: string;
  discountPercent: string;
  care: string;
};

const PLACEMENTS: Placement[] = ["Indoor", "Balcony", "Outdoor"];

function toForm(p: Plant | null, categories: Category[]): FormState {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    botanicalName: p?.botanicalName ?? "",
    category: p?.category ?? categories[0]?.slug ?? "",
    price: p ? String(p.price) : "",
    discountPercent: p?.discountPercent ? String(p.discountPercent) : "",
    description: p?.description ?? "",
    details: p?.details ?? "",
    images: p?.images?.length ? p.images : [{ src: "", alt: "" }],
    availability: p?.availability ?? "in-stock",
    sunlight: p?.sunlight ?? "",
    watering: p?.watering ?? "",
    maintenance: p?.maintenance ?? "Easy",
    size: p?.size ?? "",
    placement: p?.placement ?? ["Indoor"],
    care: p?.care?.join("\n") ?? "",
    featured: p?.featured ?? false,
  };
}

export function PlantForm({ plant, categories }: { plant: Plant | null; categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(plant, categories));
  const [slugTouched, setSlugTouched] = useState(Boolean(plant));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const setImage = (i: number, img: PlantImage) =>
    setForm((f) => ({ ...f, images: f.images.map((x, j) => (j === i ? img : x)) }));
  const moveImage = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const images = [...f.images];
      const j = i + dir;
      if (j < 0 || j >= images.length) return f;
      [images[i], images[j]] = [images[j], images[i]];
      return { ...f, images };
    });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    start(async () => {
      const res = await savePlant({
        ...form,
        id: plant?.id,
        price: form.price,
        discountPercent: form.discountPercent || "0",
        care: form.care.split("\n").map((l) => l.trim()).filter(Boolean),
        images: form.images.filter((img) => img.src.trim() || img.alt.trim()),
      });
      if (res.ok) {
        router.push("/admin/plants");
        router.refresh();
      } else {
        setErrors(res.fields ?? {});
        setMessage(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const err = (k: string) => errors[k];

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      {message && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 xl:col-span-2">
          {message}
        </p>
      )}

      <div className="space-y-6">
        <Card title="Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plant name" htmlFor="name" error={err("name")} className="sm:col-span-2">
              <input
                id="name"
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                aria-invalid={Boolean(err("name"))}
                className={inputClass}
                placeholder="e.g. Areca Palm"
              />
            </Field>
            <Field label="URL slug" htmlFor="slug" hint={`Page: /plants/${form.slug || "…"}`} error={err("slug")}>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                aria-invalid={Boolean(err("slug"))}
                className={inputClass}
              />
            </Field>
            <Field label="Botanical name" htmlFor="botanicalName" hint="Optional" error={err("botanicalName")}>
              <input id="botanicalName" value={form.botanicalName} onChange={(e) => set("botanicalName", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Short description" htmlFor="description" hint="Shown on plant cards (max 200 characters)" error={err("description")} className="sm:col-span-2">
              <input
                id="description"
                value={form.description}
                maxLength={200}
                onChange={(e) => set("description", e.target.value)}
                aria-invalid={Boolean(err("description"))}
                className={inputClass}
              />
            </Field>
            <Field label="Full description" htmlFor="details" hint="Shown on the plant's own page" error={err("details")} className="sm:col-span-2">
              <textarea
                id="details"
                rows={5}
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
                aria-invalid={Boolean(err("details"))}
                className={textareaClass}
              />
            </Field>
          </div>
        </Card>

        <Card title="Photos">
          <p className="-mt-2 mb-4 text-xs text-charcoal/55">The first photo is the cover image. Upload JPG, PNG or WebP up to 5 MB, or paste an image URL.</p>
          {err("images") && <p className="mb-3 text-xs font-medium text-red-700">{err("images")}</p>}
          <ul className="space-y-4">
            {form.images.map((img, i) => (
              <li key={i} className="flex gap-2">
                <div className="flex-1">
                  <ImageField
                    idPrefix={`img-${i}`}
                    value={img}
                    onChange={(v) => setImage(i, v)}
                    errors={{ src: err(`images.${i}.src`), alt: err(`images.${i}.alt`) }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" aria-label="Move photo up" onClick={() => moveImage(i, -1)} disabled={i === 0} className="flex size-8 items-center justify-center rounded-lg text-charcoal/55 hover:bg-olive/50 disabled:opacity-30">
                    <ArrowUp size={15} />
                  </button>
                  <button type="button" aria-label="Move photo down" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="flex size-8 items-center justify-center rounded-lg text-charcoal/55 hover:bg-olive/50 disabled:opacity-30">
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    disabled={form.images.length === 1}
                    className="flex size-8 items-center justify-center rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-30"
                  >
                    <X size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {form.images.length < 8 && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, images: [...f.images, { src: "", alt: "" }] }))}
              className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-forest/20 px-4 text-sm font-semibold text-forest hover:bg-olive/40"
            >
              <Plus size={16} /> Add photo
            </button>
          )}
        </Card>

        <Card title="Care information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plant size" htmlFor="size" hint="e.g. 60 – 75 cm (with pot)" error={err("size")}>
              <input id="size" value={form.size} onChange={(e) => set("size", e.target.value)} aria-invalid={Boolean(err("size"))} className={inputClass} />
            </Field>
            <Field label="Maintenance" htmlFor="maintenance">
              <select id="maintenance" value={form.maintenance} onChange={(e) => set("maintenance", e.target.value as Maintenance)} className={inputClass}>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Expert</option>
              </select>
            </Field>
            <Field label="Sunlight" htmlFor="sunlight" hint="e.g. Bright, indirect light" error={err("sunlight")}>
              <input id="sunlight" value={form.sunlight} onChange={(e) => set("sunlight", e.target.value)} aria-invalid={Boolean(err("sunlight"))} className={inputClass} />
            </Field>
            <Field label="Watering" htmlFor="watering" hint="e.g. Once a week" error={err("watering")}>
              <input id="watering" value={form.watering} onChange={(e) => set("watering", e.target.value)} aria-invalid={Boolean(err("watering"))} className={inputClass} />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-sm font-medium text-charcoal/85">Suitable placement</legend>
              <div className="flex flex-wrap gap-2">
                {PLACEMENTS.map((pl) => {
                  const on = form.placement.includes(pl);
                  return (
                    <label key={pl} className={cn("flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm", on ? "border-forest bg-forest text-cream" : "border-forest/20 text-charcoal/75")}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => set("placement", on ? form.placement.filter((x) => x !== pl) : [...form.placement, pl])}
                      />
                      {pl}
                    </label>
                  );
                })}
              </div>
              {err("placement") && <p className="mt-1 text-xs font-medium text-red-700">{err("placement")}</p>}
            </fieldset>
            <Field label="Care tips" htmlFor="care" hint="One tip per line" error={err("care")} className="sm:col-span-2">
              <textarea id="care" rows={5} value={form.care} onChange={(e) => set("care", e.target.value)} className={textareaClass} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Pricing & stock" className="xl:sticky xl:top-6">
          <div className="space-y-4">
            <Field label="Category" htmlFor="category" error={err("category")}>
              <select id="category" value={form.category} onChange={(e) => set("category", e.target.value)} aria-invalid={Boolean(err("category"))} className={inputClass}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (PKR)" htmlFor="price" error={err("price")}>
              <input
                id="price"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))}
                aria-invalid={Boolean(err("price"))}
                className={inputClass}
                placeholder="e.g. 2500"
              />
            </Field>
            <Field label="Discount (%)" htmlFor="discountPercent" error={err("discountPercent")}>
              <input
                id="discountPercent"
                inputMode="numeric"
                value={form.discountPercent}
                onChange={(e) => set("discountPercent", e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                aria-invalid={Boolean(err("discountPercent"))}
                aria-describedby="discount-help"
                className={inputClass}
                placeholder="0 = no discount"
              />
              <p id="discount-help" className="mt-1.5 text-xs text-charcoal/55" aria-live="polite">
                {Number(form.discountPercent) > 0 && form.price
                  ? Number(form.discountPercent) > MAX_DISCOUNT
                    ? `Maximum is ${MAX_DISCOUNT}%.`
                    : `Customers pay ${formatPrice(finalPrice({ price: Number(form.price), discountPercent: Number(form.discountPercent) }))} instead of ${formatPrice(Number(form.price))}.`
                  : `Leave empty for no discount (up to ${MAX_DISCOUNT}%).`}
              </p>
            </Field>
            <Field label="Availability" htmlFor="availability">
              <select id="availability" value={form.availability} onChange={(e) => set("availability", e.target.value as Availability)} className={inputClass}>
                <option value="in-stock">In stock</option>
                <option value="low-stock">Only a few left</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </Field>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-forest/15 p-3 text-sm">
              <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-[#234D32]" />
              <span>
                <span className="font-medium">Featured plant</span>
                <span className="block text-xs text-charcoal/55">Shown in “Featured” on the homepage</span>
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <Link href="/admin/plants" className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-forest/20 text-sm font-semibold text-forest">
                Cancel
              </Link>
              <button type="submit" disabled={pending} className="min-h-11 flex-[2] rounded-full bg-forest text-sm font-semibold text-cream hover:bg-forest-deep disabled:opacity-60">
                {pending ? "Saving…" : plant ? "Save changes" : "Add plant"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
}
