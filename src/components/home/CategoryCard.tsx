"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/types";
import { staggerItem } from "@/components/ui/Reveal";

export function CategoryCard({ category, count }: { category: Category; count?: number }) {
  return (
    <motion.div variants={staggerItem} className="h-full">
      <Link
        href={`/categories/${category.slug}`}
        className="group relative flex aspect-[3/4] h-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-forest p-4 text-cream shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-6"
      >
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent transition-opacity duration-500 group-hover:from-forest-deep/95" />

        {typeof count === "number" && (
          <span className="absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold text-forest backdrop-blur">
            {count} {count === 1 ? "plant" : "plants"}
          </span>
        )}

        <div className="relative">
          <h3 className="font-display text-xl leading-tight sm:text-2xl">{category.name}</h3>
          <p className="mt-2 hidden text-sm leading-relaxed text-cream/75 sm:block">{category.description}</p>
          <span className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-cream/15 px-4 text-xs font-semibold backdrop-blur-md transition-colors group-hover:bg-cream group-hover:text-forest sm:text-sm">
            Explore
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
