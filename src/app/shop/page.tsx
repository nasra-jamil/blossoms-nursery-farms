import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopClient } from "@/components/plants/ShopClient";
import { PlantGrid } from "@/components/plants/PlantGrid";
import { getAllCategories, getAllPlants } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop Plants Online",
  description:
    "Browse indoor, balcony, outdoor, flowering, fruit and succulent plants. Filter by category, price and availability, then order instantly on WhatsApp.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [plants, categories] = await Promise.all([getAllPlants(), getAllCategories()]);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Shop Plants" }]}
        title={
          <>
            The <em className="text-moss italic">Plant Shop</em>
          </>
        }
        description="Every plant is grown or hand-selected at our nursery. Find one you love and order it in a single WhatsApp message."
      />
      {/* useSearchParams needs a Suspense boundary; the fallback still renders the full catalogue for crawlers. */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
            <PlantGrid plants={plants} />
          </div>
        }
      >
        <ShopClient plants={plants} categories={categories} />
      </Suspense>
    </>
  );
}
