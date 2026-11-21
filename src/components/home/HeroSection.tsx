"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { unsplash } from "@/lib/format";
import { generalWhatsappUrl } from "@/lib/whatsapp";
import { FloatingLeaves } from "./FloatingLeaves";
import { HeroGrowingPlant } from "./HeroGrowingPlant";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

type Stat = { value: string; label: string };

/**
 * Compact hero: a rounded forest-green panel with a condensed headline, an
 * inline plant "pill" image, a potted plant framed in a light circle and a
 * stats row. Kept short so categories and plant cards show on first load.
 */
export function HeroSection({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section ref={ref} className="px-3 pt-[4.5rem] sm:px-4 sm:pt-[5.25rem] lg:px-6">
      <div className="relative isolate mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest via-[#1f4a2e] to-forest-deep text-cream shadow-lift sm:rounded-[2.5rem]">
        {/* soft light behind the headline */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-24 -z-10 size-[28rem] rounded-full bg-sage/15 blur-3xl"
        />
        <FloatingLeaves />

        <div className="grid items-center gap-6 px-6 pt-7 pb-5 sm:px-10 sm:pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4 lg:px-14 lg:pt-8 lg:pb-3">
          {/* Copy */}
          <div className="relative z-10">
            <h1 className="font-condensed text-[2.6rem] leading-[0.98] font-semibold tracking-tight uppercase sm:text-6xl lg:text-[3.6rem]">
              <motion.span className="block" {...fadeUp(0.05)}>
                Bring Nature
              </motion.span>
              <motion.span className="flex items-center gap-3 sm:gap-4" {...fadeUp(0.15)}>
                Closer
                <span className="relative inline-block h-[0.78em] w-[2.6em] overflow-hidden rounded-full ring-2 ring-cream/25">
                  <Image
                    src={unsplash("1525498128493-380d1990a112", 600)}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                    priority
                  />
                </span>
              </motion.span>
              <motion.span className="block text-sage" {...fadeUp(0.25)}>
                to Home
              </motion.span>
            </h1>

            <motion.p {...fadeUp(0.35)} className="mt-4 max-w-md text-sm leading-relaxed text-cream/75 sm:text-base">
              Discover beautiful plants to transform your home, balcony, and garden into a greener space.
            </motion.p>

            <motion.div {...fadeUp(0.45)} className="mt-5 flex flex-wrap items-center gap-3 sm:gap-5">
              <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/shop"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-6 text-sm font-semibold text-forest shadow-soft transition-colors hover:bg-white"
                >
                  Explore Plants
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.span>
              <motion.a
                href={generalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex min-h-12 items-center gap-3 text-sm font-semibold text-cream"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-cream/35 transition-colors group-hover:bg-cream group-hover:text-forest">
                  <WhatsAppIcon size={20} />
                </span>
                Chat on WhatsApp
              </motion.a>
            </motion.div>
          </div>

          {/* Seed-to-plant animation in a light circle (desktop/tablet) */}
          <div className="relative hidden h-full min-h-[18rem] sm:block lg:min-h-0">
            <HeroGrowingPlant circleScale={circleScale} />
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          {...fadeUp(0.55)}
          className="grid gap-4 border-t border-cream/10 px-6 py-4 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14"
        >
          <dl className="grid grid-cols-3 divide-x divide-cream/15">
            {stats.map((s) => (
              <div key={s.label} className="px-3 first:pl-0 sm:px-6">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-condensed text-2xl font-semibold tracking-tight sm:text-[1.7rem]">{s.value}</dd>
                <dd className="mt-0.5 text-[11px] text-cream/65 sm:text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="hidden max-w-sm text-sm leading-relaxed text-cream/70 lg:block">
            Healthy, nursery-grown plants for every corner — pick one you love and order it in a single WhatsApp
            message.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
