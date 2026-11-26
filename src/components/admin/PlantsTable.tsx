"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Plant } from "@/data/types";
import { deletePlant } from "@/app/admin/actions";
import { AvailabilityBadge } from "@/components/plants/AvailabilityBadge";
import { cn, formatPrice } from "@/lib/format";
import { ConfirmDelete } from "./ConfirmDelete";
import { inputClass } from "./ui";

export function PlantsTable({ plants, categories }: { plants: Plant[]; categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState(params.get("filter") ?? "all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return plants.filter((p) => {
      if (term && !`${p.name} ${p.botanicalName} ${p.slug}`.toLowerCase().includes(term)) return false;
      if (category !== "all" && p.category !== category) return false;
      if (filter === "featured" && !p.featured) return false;
      if (filter === "out-of-stock" && p.availability !== "out-of-stock") return false;
      if (filter === "low-stock" && p.availability !== "low-stock") return false;
      return true;
    });
  }, [plants, q, category, filter]);

  return (
    <div className="rounded-2xl border border-forest/10 bg-white shadow-soft">
      <div className="flex flex-col gap-3 border-b border-forest/10 p-4 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search plants</span>
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-charcoal/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…" className={cn(inputClass, "pl-9")} />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, "sm:w-52")}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={cn(inputClass, "sm:w-44")}>
            <option value="all">All statuses</option>
            <option value="featured">Featured</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </label>
      </div>

      {rows.length === 0 ? (
        <p className="p-10 text-center text-sm text-charcoal/55">No plants match these filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-xs tracking-wide text-charcoal/50 uppercase">
                <th className="px-4 py-3 font-semibold">Plant</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/[0.07]">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-cream/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-olive/40">
                        {p.images[0] && <Image src={p.images[0].src} alt="" fill sizes="48px" className="object-cover" />}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-medium text-charcoal">
                          {p.name}
                          {p.featured && <Star size={13} className="fill-amber-400 text-amber-400" aria-label="Featured" />}
                        </span>
                        <span className="block truncate text-xs text-charcoal/50">/plants/{p.slug}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/75">{p.categoryName}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <AvailabilityBadge value={p.availability} className="border border-forest/10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/plants/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${p.name} on the website`}
                        className="flex size-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-olive/50 hover:text-forest"
                      >
                        <Eye size={16} />
                      </a>
                      <Link
                        href={`/admin/plants/${p.id}/edit`}
                        aria-label={`Edit ${p.name}`}
                        className="flex size-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-olive/50 hover:text-forest"
                      >
                        <Pencil size={16} />
                      </Link>
                      <ConfirmDelete label={p.name} onConfirm={() => deletePlant(p.id)} onDone={() => router.refresh()} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
