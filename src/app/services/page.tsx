import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { services } from "@/data/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ContactCTA } from "@/components/home/ContactCTA";
import { serviceIcons } from "@/components/services/serviceIcons";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";
import { serviceQuoteUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Landscaping, Lawn & Plantation Services",
  description: `Landscaping, lawn development, farmhouse greening, housing society plantation, indoor plantscaping and garden maintenance by ${site.name}, ${site.city}.`,
  alternates: { canonical: "/services" },
};

const process = [
  { title: "Share your space", text: "Send photos, a location pin or plot size on WhatsApp." },
  { title: "Site visit & plan", text: "We visit, measure and suggest plants and a layout." },
  { title: "Quote & schedule", text: "A clear quote with plant list and timeline — no surprises." },
  { title: "Plant & aftercare", text: "Our team plants everything and guides you on upkeep." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
        title={
          <>
            Our <em className="text-moss italic">Services</em>
          </>
        }
        description={`From a single lawn to an entire housing society, ${site.name} designs, plants and maintains green spaces across Punjab — with plants grown at our own farm in ${site.city}.`}
      />

      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-24 sm:px-6 lg:space-y-24 lg:px-8">
        {services.map((s, i) => {
          const Icon = serviceIcons[s.icon];
          return (
            <section
              key={s.slug}
              id={s.slug}
              aria-labelledby={`${s.slug}-title`}
              className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal className={cn("relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft", i % 2 === 1 && "lg:order-2")}>
                <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </Reveal>
              <Reveal delay={0.1}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-olive/70 text-forest">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h2 id={`${s.slug}-title`} className="mt-5 font-display text-4xl leading-tight text-forest">
                  {s.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-charcoal/75">{s.description}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-sm text-charcoal/80">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-forest text-cream">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href={serviceQuoteUrl(s.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
                >
                  <WhatsAppIcon size={18} /> Get a quote on WhatsApp
                </a>
              </Reveal>
            </section>
          );
        })}
      </div>

      <section aria-labelledby="process-title" className="bg-olive/35">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 id="process-title" className="font-display text-4xl text-forest">
              How it <em className="text-moss italic">works</em>
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.08} className="h-full rounded-[1.5rem] bg-cream p-6 shadow-soft">
                  <span className="font-condensed text-4xl font-semibold text-sage">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl text-forest">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{p.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="pt-24">
        <ContactCTA />
      </div>
    </>
  );
}
