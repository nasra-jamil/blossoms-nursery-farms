"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/format";
import { clamp, GROWTH_STEPS as STEPS, GrowingPlant, growthStepIndex } from "./GrowingPlant";

const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export function PlantGrowingAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 });
  useMotionValueEvent(smooth, "change", (v) => setP(v));


  const progress = reduce ? 1 : p;
  const done = range(progress, 0.84, 0.97);
  const activeStep = growthStepIndex(progress);

  return (
    <section
      id="grow"
      ref={sectionRef}
      aria-label="A plant growing from seed to full leaf"
      className={cn("relative bg-cream", reduce ? "h-auto" : "h-[260vh]")}
    >
      <div
        className={cn(
          "grain flex items-center overflow-hidden",
          reduce ? "relative py-24" : "sticky top-0 h-[100svh]",
        )}
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-4 px-4 pt-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8 lg:pt-0">
          {/* Copy */}
          <div className="relative z-10 text-center lg:text-left">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-moss uppercase">
              <span className="h-px w-8 bg-moss/50" /> From our soil to your space
            </p>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-balance text-forest sm:text-5xl lg:text-6xl">
              A Little Green Goes a <em className="text-moss italic">Long Way.</em>
            </h2>
            <p className="mx-auto mt-5 hidden max-w-md text-lg leading-relaxed text-charcoal/70 sm:block lg:mx-0 [@media(max-height:760px)]:hidden">
              Every plant we sell starts right here — sown, nurtured and hardened in our nursery until it&apos;s strong
              enough to thrive in your home.
            </p>

            <ol className="mt-10 hidden space-y-1 lg:block [@media(max-height:760px)]:mt-6">
              {STEPS.map((s, i) => (
                <li key={s.label} className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500",
                      i <= activeStep ? "border-forest bg-forest text-cream" : "border-forest/20 text-forest/40",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "py-2 text-base transition-colors duration-500",
                      i === activeStep ? "font-semibold text-forest" : i < activeStep ? "text-charcoal/60" : "text-charcoal/35",
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              ))}
            </ol>

            {/* Mobile: current stage + progress bar */}
            <div className="mx-auto mt-5 max-w-xs lg:hidden">
              <p className="text-sm font-semibold text-forest" aria-live="polite">
                {STEPS[activeStep].label}
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-forest/10">
                <div className="h-full rounded-full bg-forest" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative mx-auto w-full max-w-[min(26rem,52svh)] lg:max-w-[min(34rem,62svh)]">
            <GrowingPlant progress={progress} />

            <motion.p
              initial={false}
              animate={{ opacity: done > 0.5 ? 1 : 0, y: done > 0.5 ? 0 : 10 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute inset-x-0 -bottom-2 text-center font-display text-lg text-forest italic lg:bottom-0"
            >
              Ready for its new home.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
