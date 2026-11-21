import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlantGrid } from "@/components/plants/PlantGrid";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getAllCategories, getCategoryBySlug, getPlantsByCategory } from "@/lib/catalog";
import type { CategorySlug } from "@/data/types";
import { cn } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Buy Online`,
    description: `${category.description} Browse our ${category.name.toLowerCase()} and order on WhatsApp.`,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: { images: [{ url: category.image.src, alt: category.image.alt }] },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const [plants, categories] = await Promise.all([
    getPlantsByCategory(slug as CategorySlug),
    getAllCategories(),
  ]);

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/categories", label: "Categories" },
          { label: category.name },
        ]}
        title={category.name}
        description={category.description}
      >
        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              aria-current={c.slug === category.slug ? "page" : undefined}
              className={cn(
                "flex min-h-10 shrink-0 items-center rounded-full border px-4 text-[13px] font-medium whitespace-nowrap transition-colors",
                c.slug === category.slug
                  ? "border-forest bg-forest text-cream"
                  : "border-forest/15 bg-white text-charcoal/75 hover:border-forest/40",
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-charcoal/60">
            <span className="font-semibold text-forest">{plants.length}</span> {plants.length === 1 ? "plant" : "plants"}
          </p>
          <Link
            href={`/shop?category=${category.slug}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/15 bg-white px-4 text-sm font-semibold text-forest shadow-soft"
          >
            <SlidersHorizontal size={16} /> Search & sort
          </Link>
        </div>
        <PlantGrid plants={plants} />
      </div>
      <ContactCTA />
    </>
  );
}
