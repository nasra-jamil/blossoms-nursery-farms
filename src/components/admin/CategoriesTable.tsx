"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import type { Category } from "@/data/types";
import { deleteCategory } from "@/app/admin/actions";
import { ConfirmDelete } from "./ConfirmDelete";

export function CategoriesTable({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const router = useRouter();
  if (categories.length === 0) {
    return <p className="rounded-2xl bg-white p-10 text-center text-sm text-charcoal/55 shadow-soft">No categories yet.</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((c) => (
        <li key={c.slug} className="overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-soft">
          <div className="relative aspect-[16/9] bg-olive/40">
            {c.image?.src && <Image src={c.image.src} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />}
            <span className="absolute top-3 left-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-forest">
              {counts[c.slug] ?? 0} plants
            </span>
          </div>
          <div className="flex items-start gap-2 p-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg text-forest">{c.name}</h2>
              <p className="mt-0.5 text-xs text-charcoal/50">/categories/{c.slug}</p>
              <p className="mt-2 line-clamp-2 text-sm text-charcoal/65">{c.description}</p>
            </div>
            <div className="flex shrink-0 items-center">
              <a
                href={`/categories/${c.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${c.name} on the website`}
                className="flex size-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-olive/50 hover:text-forest"
              >
                <Eye size={16} />
              </a>
              <Link
                href={`/admin/categories/${c.slug}/edit`}
                aria-label={`Edit ${c.name}`}
                className="flex size-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-olive/50 hover:text-forest"
              >
                <Pencil size={16} />
              </Link>
              <ConfirmDelete label={c.name} onConfirm={() => deleteCategory(c.slug)} onDone={() => router.refresh()} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
