"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { serviceQuoteUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/format";
import { serviceIcons } from "./serviceIcons";

/** Homepage services grid: image cards with a WhatsApp quote action each. */
export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Our Services"
          title={
            <>
              Green spaces, <em className="text-moss italic">designed & delivered</em>
            </>
          }
          description="Beyond plants — our team designs, plants and maintains lawns, farmhouses, housing societies and gardens of every size."
        />
        <Button href="/services" variant="secondary" className="group shrink-0 self-start md:self-auto">
          All services <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
      >
        {services.map((s, i) => {
          const Icon = serviceIcons[s.icon];
          return (
            <motion.li
              key={s.slug}
              variants={staggerItem}
              className={cn(
                "group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-forest p-6 text-cream shadow-soft transition-shadow duration-500 hover:shadow-lift",
                i === 0 && "lg:col-span-2",
                // 6 cards: [2,1] [1,1,1] then a full-width last card so the grid ends evenly
                i === services.length - 1 && services.length % 3 === 0 && "lg:col-span-3",
              )}
            >
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                sizes={i === 0 || i === services.length - 1 ? "(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                className="-z-20 object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/95 via-forest-deep/40 to-transparent" />

              <span className="absolute top-5 left-5 flex size-11 items-center justify-center rounded-2xl bg-cream/15 text-cream backdrop-blur-md">
                <Icon size={20} strokeWidth={1.7} />
              </span>

              <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/80">{s.short}</p>
              <a
                href={serviceQuoteUrl(s.title)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get a quote on WhatsApp for ${s.title}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-cream px-5 text-sm font-semibold text-forest transition-colors hover:bg-white"
              >
                <WhatsAppIcon size={17} /> Get a quote
              </a>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
