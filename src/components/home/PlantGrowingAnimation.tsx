"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

/* ---------- helpers ---------- */
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
/** Maps p from [a,b] to [0,1], clamped. */
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** Smooth organic easing. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const STEM_PATH = "M200 432 C 200 392, 193 344, 197 296 S 214 196, 204 112";

/** Leaves placed by their fraction along the stem. */
const LEAVES = [
  { f: 0.3, side: -1, size: 0.95, open: 28 },
  { f: 0.42, side: 1, size: 1, open: 24 },
  { f: 0.55, side: -1, size: 0.9, open: 30 },
  { f: 0.67, side: 1, size: 0.82, open: 26 },
  { f: 0.78, side: -1, size: 0.7, open: 34 },
  { f: 0.87, side: 1, size: 0.6, open: 32 },
  { f: 0.985, side: -1, size: 0.42, open: 52 },
  { f: 0.985, side: 1, size: 0.46, open: 46 },
];

const STEPS = [
  { at: 0, label: "A seed rests in the soil" },
  { at: 0.12, label: "A tiny sprout breaks through" },
  { at: 0.3, label: "The stem reaches for light" },
  { at: 0.5, label: "Leaves unfold, one by one" },
  { at: 0.84, label: "Fully grown & thriving" },
];

/** stem length (0–1) for a given scroll progress */
const stemLength = (p: number) => {
  if (p < 0.1) return 0;
  if (p < 0.26) return 0.2 * easeOut(range(p, 0.1, 0.26));
  return 0.2 + 0.8 * easeInOut(range(p, 0.26, 0.74));
};

/** Inverse of stemLength for p >= 0.26, used to time each leaf with the stem tip. */
const progressForLength = (len: number) => {
  if (len <= 0.2) return 0.1 + 0.16 * len / 0.2;
  // approximate inverse of easeInOut with linear map — good enough for timing
  return 0.26 + 0.48 * ((len - 0.2) / 0.8);
};

type Point = { x: number; y: number; angle: number };

export function PlantGrowingAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [sprout, setSprout] = useState<Point | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 });
  useMotionValueEvent(smooth, "change", (v) => setP(v));

  // Measure exact leaf attachment points on the real stem path.
  useLayoutEffect(() => {
    const path = stemRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const tip = path.getPointAtLength(0.2 * total);
    setSprout({ x: tip.x, y: tip.y, angle: -90 });
    setPoints(
      LEAVES.map(({ f }) => {
        const a = path.getPointAtLength(f * total);
        const b = path.getPointAtLength(Math.min(total, f * total + 1));
        return { x: a.x, y: a.y, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
      }),
    );
  }, []);

  const progress = reduce ? 1 : p;
  const stem = stemLength(progress);
  const seed = easeOut(range(progress, 0, 0.08));
  const crack = range(progress, 0.08, 0.16);
  const roots = easeOut(range(progress, 0.08, 0.45));
  const cotyledon = easeOut(range(progress, 0.18, 0.3));
  const glow = range(progress, 0.2, 1);
  const done = range(progress, 0.84, 0.97);
  const activeStep = STEPS.reduce((acc, s, i) => (progress >= s.at ? i : acc), 0);

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
            <svg viewBox="0 0 400 520" className="h-auto w-full" role="img" aria-label="Illustration of a seedling growing into a leafy plant">
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#D5E2C8" stopOpacity="1" />
                  <stop offset="60%" stopColor="#D5E2C8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D5E2C8" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6E523C" />
                  <stop offset="100%" stopColor="#3F2E22" />
                </linearGradient>
                <linearGradient id="leafA" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#234D32" />
                  <stop offset="100%" stopColor="#4F7A52" />
                </linearGradient>
                <linearGradient id="leafB" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2E5E3C" />
                  <stop offset="100%" stopColor="#7FA078" />
                </linearGradient>
                <clipPath id="soilClip">
                  <path d="M20 412 Q 110 400 200 408 T 380 410 V 500 a 20 20 0 0 1 -20 20 H 40 a 20 20 0 0 1 -20 -20 Z" />
                </clipPath>
              </defs>

              {/* light glow behind the plant */}
              <circle cx="200" cy="230" r={150 + glow * 60} fill="url(#sunGlow)" opacity={0.25 + glow * 0.75} />

              {/* Soil cross-section */}
              <g clipPath="url(#soilClip)">
                <rect x="0" y="390" width="400" height="140" fill="url(#soil)" />
                {[
                  [60, 448, 5], [110, 470, 3], [150, 492, 4], [262, 458, 4], [310, 486, 6], [340, 444, 3], [88, 500, 3], [236, 500, 3],
                ].map(([cx, cy, r], i) => (
                  <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#8C6D52" opacity={0.55} />
                ))}
                {/* Roots */}
                {[
                  "M200 436 C 196 456, 180 470, 168 494",
                  "M200 436 C 204 458, 222 472, 236 498",
                  "M200 438 C 200 462, 198 480, 202 510",
                  "M186 470 C 176 474, 166 478, 152 476",
                  "M222 470 C 232 476, 246 476, 258 470",
                ].map((d, i) => (
                  <path
                    key={d}
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="#E8DCC4"
                    strokeWidth={i < 3 ? 2 : 1.3}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    strokeDashoffset={1 - clamp(roots * (i < 3 ? 1 : 1.6) - (i < 3 ? 0 : 0.6))}
                    opacity={0.85}
                  />
                ))}
              </g>
              {/* soil surface line */}
              <path d="M20 412 Q 110 400 200 408 T 380 410" fill="none" stroke="#3F2E22" strokeWidth="2" opacity={0.4} />

              {/* Seed (two halves that part as it sprouts) */}
              <g transform="translate(200 436)" opacity={seed}>
                <g transform={`rotate(${-crack * 28}) translate(${-crack * 6} ${crack * 2})`}>
                  <path d="M0 -9 C -10 -9, -14 0, -12 6 C -9 10, -2 10, 0 9 Z" fill="#9A7652" />
                </g>
                <g transform={`rotate(${crack * 28}) translate(${crack * 6} ${crack * 2})`}>
                  <path d="M0 -9 C 10 -9, 14 0, 12 6 C 9 10, 2 10, 0 9 Z" fill="#B48C62" />
                </g>
              </g>

              {/* Stem */}
              <path
                ref={stemRef}
                d={STEM_PATH}
                pathLength={1}
                fill="none"
                stroke="#2E5E3C"
                strokeWidth={4 + stem * 3}
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset={1 - stem}
              />

              {/* Cotyledons (seed leaves) */}
              {sprout && (
                <g transform={`translate(${sprout.x} ${sprout.y})`} opacity={cotyledon}>
                  {[-1, 1].map((side) => (
                    <g key={side} transform={`scale(${side} 1) rotate(${-70 + cotyledon * 45}) scale(${0.35 * cotyledon})`}>
                      <path d="M0 0 C 14 -16, 44 -18, 60 -2 C 44 10, 14 10, 0 0 Z" fill="#7FA078" />
                    </g>
                  ))}
                </g>
              )}

              {/* True leaves */}
              {points &&
                LEAVES.map((leaf, i) => {
                  const pt = points[i];
                  const start = progressForLength(leaf.f) + 0.01;
                  const t = easeOut(range(progress, start, start + 0.16));
                  if (t <= 0) return null;
                  const sway = done * Math.sin((progress * 40 + i) * 0.6) * 1.5;
                  // stem tangent points "up" (≈ -90°); leaves open outward from it
                  const base = pt.angle + 90; // 0 when stem is vertical
                  const rotate = -88 + (88 - leaf.open) * t + sway; // from hugging the stem to open
                  return (
                    <g key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${base * leaf.side}) scale(${leaf.side} 1)`}>
                      <g transform={`rotate(${rotate}) scale(${leaf.size * (0.25 + 0.75 * t)})`} opacity={clamp(t * 2)}>
                        <path
                          d="M0 0 C 18 -26, 74 -34, 112 -6 C 76 18, 24 20, 0 0 Z"
                          fill={i % 2 ? "url(#leafB)" : "url(#leafA)"}
                        />
                        <path d="M4 -1 C 40 -8, 74 -10, 106 -6" stroke="#D5E2C8" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                        {[28, 50, 72].map((x) => (
                          <path key={x} d={`M${x} -5 q 8 -8 16 -12 M${x} -5 q 8 6 14 9`} stroke="#D5E2C8" strokeOpacity="0.3" strokeWidth="0.9" fill="none" />
                        ))}
                      </g>
                    </g>
                  );
                })}
            </svg>

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
