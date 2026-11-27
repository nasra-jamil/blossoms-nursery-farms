"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Citrus,
  Fence,
  Flower2,
  Salad,
  Shrub,
  Sofa,
  Tag,
  Sparkles,
  Leaf,
  TreeDeciduous,
  Trees,
  type LucideIcon,
} from "lucide-react";
import type { Category, CategorySlug } from "@/data/types";
import { cn, SALE_SLUG } from "@/lib/format";

export type SidebarValue = CategorySlug | "featured";

const icons: Partial<Record<SidebarValue, LucideIcon>> = {
  featured: Sparkles,
  [SALE_SLUG]: Tag,
  "indoor-plants": Sofa,
  "balcony-plants": Fence,
  "outdoor-plants": Trees,
  "flowering-plants": Flower2,
  trees: TreeDeciduous,
  "fruit-plants": Citrus,
  "succulents-cacti": Shrub,
  "herbs-vegetables": Salad,
};

type Props = {
  categories: Category[];
  counts: Partial<Record<CategorySlug, number>>;
  featuredCount: number;
  /** Discounted plants; the Sale entry is hidden when this is 0. */
  saleCount: number;
  active: SidebarValue;
  onSelect: (value: SidebarValue) => void;
};

/**
 * Plant category navigation: a sticky vertical list on desktop and a
 * horizontally scrolling chip row on smaller screens.
 */
export function CategorySidebar({ categories, counts, featuredCount, saleCount, active, onSelect }: Props) {
  const items: { value: SidebarValue; label: string; count: number }[] = [
    { value: "featured", label: "Featured", count: featuredCount },
    ...(saleCount > 0 ? [{ value: SALE_SLUG, label: "Sale", count: saleCount }] : []),
    ...categories.map((c) => ({ value: c.slug, label: c.name, count: counts[c.slug] ?? 0 })),
  ];

  return (
    <nav aria-label="Plant categories">
      {/* Mobile / tablet: chips */}
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden">
        {items.map(({ value, label }) => {
          const Icon = icons[value] ?? Leaf; // admin-created categories get a leaf
          const isActive = value === active;
          return (
            <li key={value} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition-colors",
                  value === SALE_SLUG
                    ? isActive
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                    : isActive
                      ? "border-forest bg-forest text-cream"
                      : "border-forest/15 bg-white text-charcoal/75",
                )}
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Desktop: sidebar */}
      <div className="sticky top-24 hidden rounded-[1.75rem] border border-forest/10 bg-cream/80 p-3 shadow-soft backdrop-blur lg:block">
        <p className="px-3 pt-2 pb-3 text-xs font-semibold tracking-[0.2em] text-moss uppercase">Categories</p>
        <ul className="space-y-0.5">
          {items.map(({ value, label, count }) => {
            const Icon = icons[value] ?? Leaf; // admin-created categories get a leaf
            const isActive = value === active;
            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => onSelect(value)}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm transition-colors",
                    isActive
                      ? "font-semibold text-cream"
                      : value === SALE_SLUG
                        ? "font-medium text-rose-700 hover:bg-rose-50"
                        : "text-charcoal/75 hover:bg-olive/50 hover:text-forest",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="category-sidebar-pill"
                      className={cn("absolute inset-0 -z-10 rounded-2xl", value === SALE_SLUG ? "bg-rose-600" : "bg-forest")}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isActive
                        ? "bg-cream/15 text-cream"
                        : value === SALE_SLUG
                          ? "bg-rose-100 text-rose-700"
                          : "bg-olive/60 text-forest group-hover:bg-olive",
                    )}
                  >
                    <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="flex-1">{label}</span>
                  <span className={cn("text-xs", isActive ? "text-cream/70" : "text-charcoal/40")}>{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <Link
          href="/categories"
          className="mt-3 flex min-h-11 items-center justify-between rounded-2xl border-t border-forest/10 px-3 pt-3 text-sm font-semibold text-forest hover:underline hover:underline-offset-4"
        >
          Browse all categories <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
