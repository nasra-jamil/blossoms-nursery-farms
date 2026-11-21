import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { getAllCategories, getCategoryCounts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Plant Categories",
  description:
    "Explore indoor plants, balcony plants, outdoor plants, flowering plants, trees, fruit plants, succulents & cacti and herbs & vegetables.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([getAllCategories(), getCategoryCounts()]);
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Categories" }]}
        title={
          <>
            Shop by <em className="text-moss italic">Category</em>
          </>
        }
        description="Whether you're greening a bright lounge, a breezy balcony or a sprawling lawn, start with the plants that suit your space."
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <CategoryGrid categories={categories} counts={counts} />
      </div>
    </>
  );
}
