import { HeroSection } from "@/components/home/HeroSection";
import { PlantGrowingAnimation } from "@/components/home/PlantGrowingAnimation";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedPlants } from "@/components/home/FeaturedPlants";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GreenInspiration } from "@/components/home/GreenInspiration";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getAllCategories, getAllPlants, getCategoryCounts, getTestimonials } from "@/lib/catalog";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [categories, counts, plants, testimonials] = await Promise.all([
    getAllCategories(),
    getCategoryCounts(),
    getAllPlants(),
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
      <FeaturedPlants plants={plants} categories={categories} />
      <WhyChooseUs />
      <GreenInspiration />
      <Testimonials items={testimonials} />
      <ContactCTA />
    </>
  );
}
