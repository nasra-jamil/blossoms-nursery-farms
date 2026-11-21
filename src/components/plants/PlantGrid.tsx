"use client";

import { motion } from "framer-motion";
import type { Plant } from "@/data/types";
import { cn } from "@/lib/format";
import { staggerContainer } from "@/components/ui/Reveal";
import { PlantCard } from "./PlantCard";

export function PlantGrid({
  plants,
  className,
  animateKey,
  columns = 4,
}: {
  plants: Plant[];
  className?: string;
  /** Change this to replay the stagger animation (e.g. when filters change). */
  animateKey?: string;
  /** Max columns on wide screens; use 3 when the grid sits beside a sidebar. */
  columns?: 3 | 4;
}) {
  return (
    <motion.ul
      key={animateKey}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-6",
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {plants.map((plant, i) => (
        <li key={plant.id} className="h-full">
          <PlantCard plant={plant} priority={i < 2} />
        </li>
      ))}
    </motion.ul>
  );
}
