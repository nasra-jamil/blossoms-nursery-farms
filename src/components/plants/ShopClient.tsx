"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, Sprout, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { Category, CategorySlug, Plant } from "@/data/types";
import { cn, finalPrice, isOnSale, SALE_SLUG } from "@/lib/format";
import { PlantGrid } from "./PlantGrid";
import {
  ProductFilters,
  sortOptions,
  type AvailabilityFilter,
  type FilterState,
  type SortKey,
} from "./ProductFilters";

const isSort = (v: string | null): v is SortKey => sortOptions.some((o) => o.value === v);
const isAvailability = (v: string | null): v is AvailabilityFilter =>
  v === "all" || v === "available" || v === "out-of-stock";

export function ShopClient({ plants, categories }: { plants: Plant[]; categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const categoryParam = params.get("category");
  const state: FilterState = {
    category:
      categoryParam === SALE_SLUG || categories.some((c) => c.slug === categoryParam)
        ? (categoryParam as CategorySlug)
        : "all",
    availability: isAvailability(params.get("availability")) ? (params.get("availability") as AvailabilityFilter) : "all",
    sort: isSort(params.get("sort")) ? (params.get("sort") as SortKey) : "featured",
  };

  const [query, setQuery] = useState(params.get("q") ?? "");
  const deferredQuery = useDeferredValue(query);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updateUrl = (patch: Partial<FilterState & { q: string }>) => {
    const next = new URLSearchParams(params.toString());
    const merged = { ...state, q: query, ...patch };
    const defaults: Record<string, string> = { category: "all", availability: "all", sort: "featured", q: "" };
    for (const key of Object.keys(defaults)) {
      const value = String(merged[key as keyof typeof merged] ?? "").trim();
      if (!value || value === defaults[key]) next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Keep the search term in the URL (debounced) so results are shareable.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== query.trim()) updateUrl({ q: query });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  // Counts reflect the current search + availability, so the sidebar stays honest.
  const searchFiltered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return plants.filter((p) => {
      if (q && !`${p.name} ${p.botanicalName}`.toLowerCase().includes(q)) return false;
      if (state.availability === "available" && p.availability === "out-of-stock") return false;
      if (state.availability === "out-of-stock" && p.availability !== "out-of-stock") return false;
      return true;
    });
  }, [plants, deferredQuery, state.availability]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of searchFiltered) {
      c[p.category] = (c[p.category] ?? 0) + 1;
      if (isOnSale(p)) c[SALE_SLUG] = (c[SALE_SLUG] ?? 0) + 1;
    }
    return c;
  }, [searchFiltered]);

  const results = useMemo(() => {
    const list = searchFiltered.filter((p) =>
      state.category === "all" ? true : state.category === SALE_SLUG ? isOnSale(p) : p.category === state.category,
    );
    const sorted = [...list];
    switch (state.sort) {
      case "price-asc":
        sorted.sort((a, b) => finalPrice(a) - finalPrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => finalPrice(b) - finalPrice(a));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return sorted;
  }, [searchFiltered, state.category, state.sort]);

  // Offer "Sale" whenever something is discounted (or when it's the active filter, so it can be unselected).
  const hasSale = plants.some(isOnSale) || state.category === SALE_SLUG;
  const activeCategory =
    state.category === SALE_SLUG ? { name: "Sale" } : categories.find((c) => c.slug === state.category);
  const activeFilterCount = Number(state.category !== "all") + Number(state.availability !== "all");
  const resetAll = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-forest/10 bg-cream/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <label className="relative flex-1 lg:max-w-md">
            <span className="sr-only">Search plants by name</span>
            <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-charcoal/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plants…"
              className="h-12 w-full rounded-full border border-forest/15 bg-white pr-10 pl-11 text-sm shadow-soft transition outline-none placeholder:text-charcoal/40 focus:border-forest/40 focus:ring-4 focus:ring-olive"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/50 hover:bg-olive/50"
              >
                <X size={16} />
              </button>
            )}
          </label>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative inline-flex h-12 items-center gap-2 rounded-full border border-forest/15 bg-white px-4 text-sm font-semibold text-forest shadow-soft lg:hidden"
            aria-haspopup="dialog"
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] text-cream">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative ml-auto hidden lg:block">
            <label htmlFor="sort" className="sr-only">
              Sort plants
            </label>
            <select
              id="sort"
              value={state.sort}
              onChange={(e) => updateUrl({ sort: e.target.value as SortKey })}
              className="h-12 cursor-pointer appearance-none rounded-full border border-forest/15 bg-white pr-11 pl-5 text-sm font-medium text-forest shadow-soft outline-none focus:ring-4 focus:ring-olive"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-forest" />
          </div>
        </div>

        {/* Mobile category chips */}
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:hidden">
          {[{ slug: "all", name: "All" }, ...(hasSale ? [{ slug: SALE_SLUG, name: "Sale" }] : []), ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => updateUrl({ category: c.slug })}
              className={cn(
                "min-h-10 shrink-0 rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition-colors",
                state.category === c.slug
                  ? c.slug === SALE_SLUG
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-forest bg-forest text-cream"
                  : c.slug === SALE_SLUG
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-forest/15 bg-white text-charcoal/75",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              counts={counts}
              total={searchFiltered.length}
              state={state}
              onChange={updateUrl}
              hasSale={hasSale}
            />
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-charcoal/60" aria-live="polite">
              Showing <span className="font-semibold text-forest">{results.length}</span>{" "}
              {results.length === 1 ? "plant" : "plants"}
              {activeCategory && (
                <>
                  {" "}
                  in <span className="font-semibold text-forest">{activeCategory.name}</span>
                </>
              )}
              {deferredQuery.trim() && <> matching “{deferredQuery.trim()}”</>}
            </p>
            {(activeFilterCount > 0 || query) && (
              <button type="button" onClick={resetAll} className="text-sm font-semibold text-forest underline underline-offset-4">
                Clear all
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <PlantGrid
              plants={results}
              animateKey={`${state.category}-${state.availability}-${state.sort}-${deferredQuery}`}
              columns={3}
            />
          ) : (
            <div className="flex flex-col items-center rounded-[2rem] border border-dashed border-forest/20 px-6 py-20 text-center">
              <Sprout size={40} className="text-sage" strokeWidth={1.4} />
              <h2 className="mt-4 font-display text-2xl text-forest">No plants found</h2>
              <p className="mt-2 max-w-sm text-sm text-charcoal/60">
                Try a different name or clear your filters. Can&apos;t find what you need? Message us — we may have it in
                the nursery.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-6 min-h-11 rounded-full bg-forest px-6 text-sm font-semibold text-cream"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filter plants"
              className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[88dvh] flex-col rounded-t-[2rem] bg-cream shadow-lift lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 120 && setDrawerOpen(false)}
            >
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-forest/20" />
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <h2 className="font-display text-2xl text-forest">Filters</h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="flex size-11 items-center justify-center rounded-full hover:bg-olive/60"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <ProductFilters
                  categories={categories}
                  counts={counts}
                  total={searchFiltered.length}
                  state={state}
                  onChange={updateUrl}
                  hasSale={hasSale}
                  showSort
                />
              </div>
              <div className="flex gap-3 border-t border-forest/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={resetAll}
                  className="min-h-12 flex-1 rounded-full border border-forest/20 text-sm font-semibold text-forest"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="min-h-12 flex-[2] rounded-full bg-forest text-sm font-semibold text-cream"
                >
                  Show {results.length} {results.length === 1 ? "plant" : "plants"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
