"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn, unsplash } from "@/lib/format";

const tiles = [
  {
    title: "Indoor Decoration",
    caption: "Layer leafy floor plants with trailing shelf greens for a calm, lived-in look.",
    href: "/categories/indoor-plants",
    src: unsplash("1600210492486-724fe5c67fb0", 1400),
    alt: "Sunny, airy living room styled with tall potted plants beside leather sofas",
    className: "lg:col-span-7 lg:row-span-2 aspect-[4/5] lg:aspect-auto",
    speed: 40,
  },
  {
    title: "Balcony Gardens",
    caption: "Shelves, hangers and pots turn the smallest ledge into a green retreat.",
    href: "/categories/balcony-plants",
    src: unsplash("1601985705806-5b9a71f6004f", 1200),
    alt: "Open-air terrace with wooden shelves crowded with potted green plants",
    className: "lg:col-span-5 aspect-[4/3]",
    speed: 70,
  },
  {
    title: "Outdoor Landscapes",
    caption: "Arches, hedges and canopy trees that grow more beautiful every year.",
    href: "/categories/outdoor-plants",
    src: unsplash("1558293842-c0fd3db86157", 1200),
    alt: "Garden path lined with lush greenery beneath a flowering wisteria arch",
    className: "lg:col-span-5 aspect-[4/3]",
    speed: 55,
  },
  {
    title: "Flower Gardens",
    caption: "Roses, daisies and seasonal blooms for colour from spring to autumn.",
    href: "/categories/flowering-plants",
    src: unsplash("1585320806297-9794b3e4eeae", 1600),
    alt: "Brick garden path bordered by blooming pink rose bushes and clipped hedges",
    className: "lg:col-span-12 aspect-[4/3] sm:aspect-[21/9]",
    speed: 45,
  },
];

function ParallaxTile({ tile, progress }: { tile: (typeof tiles)[number]; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [-tile.speed, tile.speed]);
  return (
    <Reveal className={cn("group relative overflow-hidden rounded-[1.75rem] bg-forest", tile.className)}>
      <Link href={tile.href} className="absolute inset-0 block">
        <motion.div style={{ y }} className="absolute -inset-y-24 inset-x-0">
          <Image
            src={tile.src}
            alt={tile.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-cream sm:p-7">
          <div className="max-w-md">
            <h3 className="font-display text-2xl sm:text-3xl">{tile.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/80">{tile.caption}</p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cream/15 backdrop-blur transition-colors group-hover:bg-cream group-hover:text-forest">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function GreenInspiration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <SectionHeading
          eyebrow="Green Inspiration"
          title={
            <>
              Life is better <em className="text-moss italic">surrounded by green</em>
            </>
          }
        />
        <Reveal delay={0.1}>
          <p className="max-w-lg text-lg leading-relaxed text-charcoal/70 lg:ml-auto">
            Plants slow us down, clean the air we breathe and turn houses into homes. Start with one pot on a windowsill —
            you&apos;ll be surprised how quickly a little green grows into a way of life.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="mt-14 grid gap-4 sm:gap-5 lg:auto-rows-[minmax(16rem,auto)] lg:grid-cols-12">
        {tiles.map((tile) => (
          <ParallaxTile key={tile.title} tile={tile} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
