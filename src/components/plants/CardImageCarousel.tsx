"use client";

import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PlantImage } from "@/data/types";
import { cn } from "@/lib/format";

const INTERVAL_MS = 3000;

/** Small stable offset per plant so cards in a grid don't all fade at the same instant. */
function offsetFor(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h) % 900;
}

type Props = {
  images: PlantImage[];
  seed: string;
  priority?: boolean;
  sizes: string;
  className?: string;
};

/**
 * Product-card photo that cross-fades through a plant's images every 3 seconds.
 * Only runs while the card is on screen, and stays on the first photo for
 * visitors who prefer reduced motion. Later photos load only when they're next.
 */
export function CardImageCarousel({ images, seed, priority = false, sizes, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [{ index, prev }, setSlide] = useState({ index: 0, prev: -1 });
  // How many images have been mounted so far (current + the one preloading next).
  const [loaded, setLoaded] = useState(1);
  const multiple = images.length > 1;
  const playing = multiple && inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const advance = () => setSlide(({ index: i }) => ({ index: (i + 1) % images.length, prev: i }));
    const start = setTimeout(() => {
      advance();
      interval = setInterval(advance, INTERVAL_MS);
    }, INTERVAL_MS + offsetFor(seed));
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [playing, images.length, seed]);

  // Keep the next photo mounted (invisible) so it has loaded before it fades in.
  useEffect(() => {
    if (playing) setLoaded((n) => Math.min(images.length, Math.max(n, index + 2)));
  }, [playing, index, images.length]);

  return (
    <div ref={ref} className="absolute inset-0">
      {images.slice(0, multiple ? loaded : 1).map((img, i) => (
        <Image
          key={img.src + i}
          src={img.src}
          alt={i === index ? img.alt : ""}
          aria-hidden={i === index ? undefined : true}
          fill
          priority={priority && i === 0}
          sizes={sizes}
          className={cn(
            "object-cover transition-[opacity,transform] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]",
            // The new photo fades in on top while the previous one stays solid underneath.
            i === index ? "z-[1] opacity-100" : i === prev ? "z-0 opacity-100" : "z-0 opacity-0",
            className,
          )}
        />
      ))}

      {multiple && (
        <div className="absolute bottom-3 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5" aria-hidden="true">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full bg-white shadow-sm transition-all duration-500",
                i === index ? "w-4 opacity-100" : "w-1.5 opacity-60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
