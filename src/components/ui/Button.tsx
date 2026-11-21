"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "light" | "ghost" | "whatsapp";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-cream hover:bg-forest-deep shadow-soft",
  secondary: "border border-forest/25 text-forest hover:border-forest hover:bg-forest/5",
  light: "bg-cream text-forest hover:bg-white shadow-soft",
  ghost: "border border-cream/40 text-cream hover:bg-cream/10",
  whatsapp: "bg-[#1f8f4e] text-white hover:bg-[#187a42] shadow-soft",
};

const MotionLink = motion.create(Link);

export function Button({
  href,
  variant = "primary",
  external,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
    variants[variant],
    className,
  );
  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  };

  if (external) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={classes} {...motionProps}>
        {children}
      </motion.a>
    );
  }
  return (
    <MotionLink href={href} aria-label={ariaLabel} className={classes} {...motionProps}>
      {children}
    </MotionLink>
  );
}
