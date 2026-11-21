"use client";

import { motion } from "framer-motion";
import type { Plant } from "@/data/types";
import { cn } from "@/lib/format";
import { generalWhatsappUrl, plantOrderUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

type Props = {
  plant?: Pick<Plant, "name" | "price" | "slug" | "availability">;
  label?: string;
  size?: "sm" | "md" | "lg";
  tone?: "forest" | "cream";
  className?: string;
};

/**
 * Primary purchase action. Opens WhatsApp with a pre-filled message for the
 * given plant (or a general enquiry when no plant is passed).
 */
export function WhatsAppButton({ plant, label, size = "md", tone = "forest", className }: Props) {
  const href = plant ? plantOrderUrl(plant) : generalWhatsappUrl;
  const outOfStock = plant?.availability === "out-of-stock";
  const text = label ?? (outOfStock ? "Ask on WhatsApp" : "Order on WhatsApp");

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={plant ? `${text}: ${plant.name}` : text}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
        outOfStock
          ? "border border-forest/25 bg-transparent text-forest hover:bg-forest/5"
          : tone === "cream"
            ? "bg-cream text-forest hover:bg-white"
            : "bg-forest text-cream hover:bg-forest-deep",
        size === "sm" && "min-h-11 px-4 text-[13px]",
        size === "md" && "min-h-12 px-5 text-sm",
        size === "lg" && "min-h-14 px-8 text-base",
        className,
      )}
    >
      <WhatsAppIcon size={size === "lg" ? 22 : 18} />
      <span>{text}</span>
    </motion.a>
  );
}
