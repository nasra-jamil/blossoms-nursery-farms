import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ContactCTA } from "@/components/home/ContactCTA";
import { unsplash } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Meet ${site.name} — a family-run plant nursery in ${site.city} growing healthy, climate-ready plants for homes and gardens across Pakistan.`,
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Grown, not just sold", text: "Most of our plants are propagated and raised in our own beds, so we know their roots — literally." },
  { title: "Honest advice", text: "If a plant won't suit your light or climate, we'll tell you, and suggest one that will." },
  { title: "Care after delivery", text: "Every order comes with care guidance, and we're on WhatsApp whenever you have a question." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "About Us" }]}
        title={
          <>
            Rooted in <em className="text-moss italic">care</em>
          </>
        }
        description={`${site.name} began as a small nursery in ${site.city}, Pakistan's city of flowers, with a simple belief: everyone deserves a little more green in their life.`}
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
          <Image
            src={unsplash("1416879595882-3373a0480b5b", 1400)}
            alt="A garden trowel scooping rich dark potting soil"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl leading-tight text-forest">From our soil to your space</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-charcoal/75">
            <p>
              What started with a few rows of roses and money plants has grown into a nursery of hundreds of varieties
              — from air-purifying indoor plants to grafted fruit trees ready for your courtyard.
            </p>
            <p>
              We grow with Pakistan&apos;s climate in mind, hardening every plant through real heat and real winters
              before it leaves us. That&apos;s why our plants settle in quickly and keep thriving.
            </p>
            <p>
              We keep ordering simple, too. No carts or checkout forms — just message us on WhatsApp, and a real person
              from our team will help you choose, confirm stock and arrange delivery.
            </p>
          </div>
          <ul className="mt-10 grid gap-6">
            {values.map((v) => (
              <li key={v.title} className="border-l-2 border-sage pl-5">
                <h3 className="font-display text-xl text-forest">{v.title}</h3>
                <p className="mt-1 text-charcoal/70">{v.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <WhyChooseUs />
      <div className="pt-24 lg:pt-32">
        <ContactCTA />
      </div>
    </>
  );
}
