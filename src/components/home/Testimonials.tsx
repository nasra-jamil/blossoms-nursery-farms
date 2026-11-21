"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} className={i < rating ? "fill-forest text-forest" : "text-forest/20"} />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <span className="flex size-12 items-center justify-center rounded-full bg-olive font-display text-lg text-forest">
      {initials}
    </span>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [go, paused]);

  const current = items[index];

  return (
    <section className="grain bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title={
            <>
              Kind words from <em className="text-moss italic">happy homes</em>
            </>
          }
        />

        <div
          className="relative mx-auto mt-14 max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-forest/10 bg-white px-6 py-12 shadow-soft sm:px-14 sm:py-16">
            <Quote aria-hidden="true" className="absolute top-8 right-8 size-16 text-olive sm:size-24" strokeWidth={1} />
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                aria-live="polite"
              >
                <Stars rating={current.rating} />
                <blockquote className="mt-6 font-display text-2xl leading-snug text-forest sm:text-3xl">
                  “{current.review}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <Avatar name={current.name} />
                  <div>
                    <p className="font-semibold text-charcoal">{current.name}</p>
                    <p className="text-sm text-charcoal/60">
                      {current.location} · bought {current.plant}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Choose a testimonial">
              {items.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Review by ${t.name}`}
                  onClick={() => setIndex(i)}
                  className="flex h-11 items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-500",
                      i === index ? "w-10 bg-forest" : "w-4 bg-forest/20 hover:bg-forest/40",
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex size-12 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="flex size-12 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
