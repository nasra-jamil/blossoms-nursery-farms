"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Category } from "@/data/types";
import { saveCategory } from "@/app/admin/actions";
import { ImageField } from "./ImageField";
import { Card, Field, inputClass, slugify, textareaClass } from "./ui";

export function CategoryForm({ category, plantCount = 0 }: { category: Category | null; plantCount?: number }) {
  const router = useRouter();
  const [form, setForm] = useState<Category>(
    category ?? { slug: "", name: "", description: "", image: { src: "", alt: "" } },
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    start(async () => {
      const res = await saveCategory({ ...form, originalSlug: category?.slug });
      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        setErrors(res.fields ?? {});
        setMessage(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-6">
      {message && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">
          {message}
        </p>
      )}
      <Card>
        <div className="space-y-4">
          <Field label="Category name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
              }}
              aria-invalid={Boolean(errors.name)}
              className={inputClass}
              placeholder="e.g. Hanging Plants"
            />
          </Field>
          <Field
            label="URL slug"
            htmlFor="slug"
            error={errors.slug}
            hint={
              category && plantCount > 0
                ? `Page: /categories/${form.slug || "…"} — changing this moves its ${plantCount} plants automatically, but old links will stop working.`
                : `Page: /categories/${form.slug || "…"}`
            }
          >
            <input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
              }}
              aria-invalid={Boolean(errors.slug)}
              className={inputClass}
            />
          </Field>
          <Field label="Description" htmlFor="description" hint="Shown on category cards and the category page" error={errors.description}>
            <textarea
              id="description"
              rows={3}
              maxLength={200}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              aria-invalid={Boolean(errors.description)}
              className={textareaClass}
            />
          </Field>
          <div>
            <p className="mb-1.5 text-sm font-medium text-charcoal/85">Cover image</p>
            <ImageField
              idPrefix="cat-img"
              value={form.image}
              onChange={(image) => setForm((f) => ({ ...f, image }))}
              errors={{ src: errors["image.src"], alt: errors["image.alt"] }}
            />
          </div>
        </div>
      </Card>
      <div className="flex gap-2">
        <Link href="/admin/categories" className="flex min-h-11 items-center justify-center rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest">
          Cancel
        </Link>
        <button type="submit" disabled={pending} className="min-h-11 rounded-full bg-forest px-8 text-sm font-semibold text-cream hover:bg-forest-deep disabled:opacity-60">
          {pending ? "Saving…" : category ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}
