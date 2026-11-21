import { HeroSection } from "@/components/home/HeroSection";
import { PlantGrowingAnimation } from "@/components/home/PlantGrowingAnimation";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedPlants } from "@/components/home/FeaturedPlants";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GreenInspiration } from "@/components/home/GreenInspiration";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getAllCategories, getCategoryCounts, getFeaturedPlants, getTestimonials } from "@/lib/catalog";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [categories, counts, featured, testimonials] = await Promise.all([
    getAllCategories(),
    getCategoryCounts(),
    getFeaturedPlants(8),
    getTestimonials(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GardenStore",
    name: `${site.name} Plant Nursery`,
    description: site.description,
    url: site.url,
    telephone: `+${site.whatsappNumber}`,
    email: site.email,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "PK" },
    openingHours: "Mo-Sa 09:00-19:00",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <PlantGrowingAnimation />
      <CategorySection categories={categories} counts={counts} />
      <FeaturedPlants plants={featured} />
      <WhyChooseUs />
      <GreenInspiration />
      <Testimonials items={testimonials} />
      <ContactCTA />
    </>
  );
}
