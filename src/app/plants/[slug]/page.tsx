import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Leaf } from "lucide-react";
import { ProductDetails } from "@/components/plants/ProductDetails";
import { PlantGrid } from "@/components/plants/PlantGrid";
import { Reveal } from "@/components/ui/Reveal";
import { getAllPlants, getCategoryBySlug, getPlantBySlug, getRelatedPlants } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const plants = await getAllPlants();
  return plants.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);
  if (!plant) return {};
  const title = `${plant.name} — ${formatPrice(plant.price)}`;
  return {
    title,
    description: `${plant.description} ${plant.sunlight}, ${plant.maintenance.toLowerCase()} care. Order ${plant.name} on WhatsApp from ${site.name}.`,
    alternates: { canonical: `/plants/${plant.slug}` },
    openGraph: {
      title,
      description: plant.description,
      images: [{ url: plant.images[0].src, alt: plant.images[0].alt }],
    },
  };
}

export default async function PlantPage({ params }: Params) {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);
  if (!plant) notFound();
  const [category, related] = await Promise.all([getCategoryBySlug(plant.category), getRelatedPlants(slug, 4)]);
  if (!category) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plant.name,
    description: plant.details,
    image: plant.images.map((i) => i.src),
    category: category.name,
    sku: plant.id,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: plant.price,
      availability:
        plant.availability === "out-of-stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${site.url}/plants/${plant.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-charcoal/55">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              { href: `/categories/${category.slug}`, label: category.name },
            ].map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <Link href={c.href} className="hover:text-forest">
                  {c.label}
                </Link>
                <ChevronRight size={14} aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page" className="text-forest">
              {plant.name}
            </li>
          </ol>
        </nav>

        <ProductDetails plant={plant} category={category} />
      </div>

      <section aria-labelledby="care-heading" className="bg-olive/35">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-moss uppercase">
              <span className="h-px w-8 bg-moss/50" /> Plant care
            </p>
            <h2 id="care-heading" className="font-display text-4xl leading-tight text-forest">
              Keeping your {plant.name.split(" (")[0]} happy
            </h2>
            <p className="mt-4 text-charcoal/70">
              Simple, practical tips from our growers. Need more help? We&apos;re always a WhatsApp message away.
            </p>
          </Reveal>
          <ol className="grid gap-4">
            {plant.care.map((tip, i) => (
              <li key={tip}>
                <Reveal delay={i * 0.06} y={16} className="flex gap-4 rounded-2xl bg-cream p-5 shadow-soft">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-cream">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-charcoal/80">{tip}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl text-forest">
              <Leaf className="mr-2 inline size-7 text-sage" aria-hidden="true" />
              You may also love
            </h2>
            <Link href={`/categories/${category.slug}`} className="hidden text-sm font-semibold text-forest underline underline-offset-4 sm:block">
              More {category.name.toLowerCase()}
            </Link>
          </Reveal>
          <PlantGrid plants={related} />
        </section>
      )}
    </>
  );
}
