"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, CategorySlug, Plant } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { PlantGrid } from "@/components/plants/PlantGrid";
import { CategorySidebar, type SidebarValue } from "@/components/plants/CategorySidebar";

const LIMIT = 6;

export function FeaturedPlants({ plants, categories }: { plants: Plant[]; categories: Category[] }) {
  const [active, setActive] = useState<SidebarValue>("featured");

  const featured = useMemo(() => plants.filter((p) => p.featured), [plants]);
  const counts = useMemo(() => {
    const c: Partial<Record<CategorySlug, number>> = {};
    for (const p of plants) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [plants]);

  const list = active === "featured" ? featured : plants.filter((p) => p.category === active);
  const visible = list.slice(0, LIMIT);
  const moreHref = active === "featured" ? "/shop" : `/categories/${active}`;
  const activeName = categories.find((c) => c.slug === active)?.name;

  return (
    <section className="bg-olive/35">
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-20 sm:px-6 sm:pt-6 lg:px-8 lg:pb-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Button href="/shop" variant="primary" className="group shrink-0 self-start md:self-auto">
            Shop all plants <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[17rem_1fr] lg:gap-10">
          <aside className="min-w-0">
            <CategorySidebar
              categories={categories}
              counts={counts}
              featuredCount={featured.length}
              active={active}
              onSelect={setActive}
            />
          </aside>

          <div className="min-w-0">
            <PlantGrid plants={visible} animateKey={active} columns={3} />
            {list.length > LIMIT && (
              <div className="mt-10 flex justify-center">
                <Link
                  href={moreHref}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/25 px-6 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
                >
                  View all {list.length} {activeName ? activeName.toLowerCase() : "featured plants"}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
