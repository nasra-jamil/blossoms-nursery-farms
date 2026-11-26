"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Plant } from "@/data/types";
import { cn, formatPrice } from "@/lib/format";
import { staggerItem } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AvailabilityBadge } from "./AvailabilityBadge";

export function PlantCard({ plant, priority = false }: { plant: Plant; priority?: boolean }) {
  const cover = plant.images[0];
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
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]",
            soldOut && "grayscale-[35%]",
          )}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
        <AvailabilityBadge value={plant.availability} className="absolute top-3 left-3" />
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
          <p className="mb-3 text-base font-semibold text-charcoal sm:text-lg">{formatPrice(plant.price)}</p>
          <WhatsAppButton plant={plant} size="sm" className="w-full" label={soldOut ? "Ask on WhatsApp" : "Order"} />
        </div>
      </div>
    </motion.article>
  );
}
