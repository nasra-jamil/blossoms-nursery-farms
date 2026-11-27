"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Plant } from "@/data/types";
import { cn } from "@/lib/format";
import { staggerItem } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { CardImageCarousel } from "./CardImageCarousel";
import { DiscountBadge, PriceTag } from "./PriceTag";

export function PlantCard({ plant, priority = false }: { plant: Plant; priority?: boolean }) {
  const soldOut = plant.availability === "out-of-stock";

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest/[0.07] bg-white shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      <Link
        href={`/plants/${plant.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-olive/40"
        aria-label={`View details for ${plant.name}`}
      >
        <CardImageCarousel
          images={plant.images}
          seed={plant.id}
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
          className={cn(soldOut && "grayscale-[35%]")}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
        <AvailabilityBadge value={plant.availability} className="absolute top-3 left-3 z-[2]" />
        <DiscountBadge plant={plant} className="absolute top-3 right-3 z-[2]" />
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-moss uppercase sm:text-[11px]">
          {plant.categoryName ?? plant.category}
        </p>
        <h3 className="mt-1.5 font-display text-lg leading-tight text-forest sm:text-xl">
          <Link href={`/plants/${plant.slug}`} className="hover:underline hover:decoration-sage hover:underline-offset-4">
            {plant.name}
          </Link>
        </h3>
        <p className="mt-2 hidden text-sm sm:line-clamp-2 leading-relaxed text-charcoal/65">
          {plant.description}
        </p>
        <div className="mt-auto pt-4">
          <PriceTag plant={plant} className="mb-3" />
          <WhatsAppButton plant={plant} size="sm" className="w-full" label={soldOut ? "Ask on WhatsApp" : "Order"} />
        </div>
      </div>
    </motion.article>
  );
}
