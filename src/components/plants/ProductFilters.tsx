"use client";

import { Check } from "lucide-react";
import type { Category, CategorySlug } from "@/data/types";
import { cn, SALE_SLUG } from "@/lib/format";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";
export type AvailabilityFilter = "all" | "available" | "out-of-stock";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A – Z" },
];

export const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All plants" },
  { value: "available", label: "Available now" },
  { value: "out-of-stock", label: "Out of stock" },
];

export type FilterState = {
  category: CategorySlug | "all";
  availability: AvailabilityFilter;
  sort: SortKey;
};

type Props = {
  categories: Category[];
  counts: Record<string, number>;
  total: number;
  state: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  showSort?: boolean;
  /** Show the automatic "Sale" option (only when something is discounted). */
  hasSale?: boolean;
};

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-forest/10 pb-6 last:border-0">
      <legend className="mb-3 text-xs font-semibold tracking-[0.2em] text-moss uppercase">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function Option({
  name,
  checked,
  onSelect,
  label,
  count,
  tone = "default",
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  count?: number;
  tone?: "default" | "sale";
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 text-sm transition-colors",
        tone === "sale"
          ? checked
            ? "bg-rose-50 font-semibold text-rose-700"
            : "text-rose-700 hover:bg-rose-50"
          : checked
            ? "bg-olive/70 font-semibold text-forest"
            : "text-charcoal/75 hover:bg-olive/35",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-4 items-center justify-center rounded-full border transition-colors",
            checked
              ? tone === "sale"
                ? "border-rose-600 bg-rose-600 text-white"
                : "border-forest bg-forest text-cream"
              : tone === "sale"
                ? "border-rose-300"
                : "border-forest/30",
          )}
          aria-hidden="true"
        >
          {checked && <Check size={10} strokeWidth={3} />}
        </span>
        {label}
      </span>
      {typeof count === "number" && <span className="text-xs text-charcoal/45">{count}</span>}
    </label>
  );
}

/** Category / availability / sort controls. Used in the desktop sidebar and the mobile drawer. */
export function ProductFilters({ categories, counts, total, state, onChange, showSort = false, hasSale = false }: Props) {
  return (
    <div className="space-y-6">
      <FilterGroup title="Category">
        <Option
          name="category"
          checked={state.category === "all"}
          onSelect={() => onChange({ category: "all" })}
          label="All plants"
          count={total}
        />
        {hasSale && (
          <Option
            name="category"
            checked={state.category === SALE_SLUG}
            onSelect={() => onChange({ category: SALE_SLUG })}
            label="Sale"
            count={counts[SALE_SLUG] ?? 0}
            tone="sale"
          />
        )}
        {categories.map((c) => (
          <Option
            key={c.slug}
            name="category"
            checked={state.category === c.slug}
            onSelect={() => onChange({ category: c.slug })}
            label={c.name}
            count={counts[c.slug]}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        {availabilityOptions.map((o) => (
          <Option
            key={o.value}
            name="availability"
            checked={state.availability === o.value}
            onSelect={() => onChange({ availability: o.value })}
            label={o.label}
          />
        ))}
      </FilterGroup>

      {showSort && (
        <FilterGroup title="Sort by">
          {sortOptions.map((o) => (
            <Option
              key={o.value}
              name="sort"
              checked={state.sort === o.value}
              onSelect={() => onChange({ sort: o.value })}
              label={o.label}
            />
          ))}
        </FilterGroup>
      )}
    </div>
  );
}
