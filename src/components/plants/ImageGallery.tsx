"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { PlantImage } from "@/data/types";
import { cn } from "@/lib/format";

export function ImageGallery({ images, name }: { images: PlantImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row-reverse">
      <div
        className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[2rem] bg-olive/40 shadow-soft"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[active].src}
              alt={images[active].alt}
              fill
              priority={active === 0}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out"
              style={{
                transform: zoom.on ? "scale(1.6)" : "scale(1)",
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-3 overflow-x-auto lg:w-24 lg:flex-col" aria-label={`${name} photos`}>
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-pressed={i === active}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-2xl transition-all duration-300 lg:size-24",
                  i === active ? "ring-2 ring-forest ring-offset-2 ring-offset-cream" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
