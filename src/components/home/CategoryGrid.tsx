"use client";

import { motion } from "framer-motion";
import type { Category, CategorySlug } from "@/data/types";
import { staggerContainer } from "@/components/ui/Reveal";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid({ categories, counts }: { categories: Category[]; counts: Record<CategorySlug, number> }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
    >
      {categories.map((c) => (
        <CategoryCard key={c.slug} category={c} count={counts[c.slug]} />
      ))}
    </motion.div>
  );
}
