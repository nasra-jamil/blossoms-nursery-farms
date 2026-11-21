import { HeroSection } from "@/components/home/HeroSection";
import { PlantGrowingAnimation } from "@/components/home/PlantGrowingAnimation";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedPlants } from "@/components/home/FeaturedPlants";
import { ServicesSection } from "@/components/services/ServicesSection";
import { services } from "@/data/services";
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
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: `+${site.whatsappNumber}`,
    email: site.email,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "PK" },
    openingHours: "Mo-Su 08:00-22:00",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection
        stats={[
          { value: `${plants.length}+`, label: "Plant varieties" },
          { value: `${categories.length}`, label: "Categories" },
          { value: "One Click", label: "WhatsApp ordering" },
        ]}
      />
      <FeaturedPlants plants={plants} categories={categories} />
      <ServicesSection services={services} />
      <WhyChooseUs />
      <GreenInspiration />
      <Testimonials items={testimonials} />
      <ContactCTA />
    </>
  );
}
