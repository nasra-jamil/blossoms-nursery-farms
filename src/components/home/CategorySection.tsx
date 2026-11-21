import type { Category, CategorySlug } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryGrid } from "./CategoryGrid";

export function CategorySection({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<CategorySlug, number>;
}) {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Shop by Category"
          title={
            <>
              Find the right plant for <em className="text-moss italic">every corner</em>
            </>
          }
          description="From shaded living rooms to sun-drenched rooftops — browse plants grouped by where and how they love to grow."
        />
        <Button href="/categories" variant="secondary" className="shrink-0 self-start md:self-auto">
          All categories
        </Button>
      </div>

      <div className="mt-12">
        <CategoryGrid categories={categories} counts={counts} />
      </div>
    </section>
  );
}
