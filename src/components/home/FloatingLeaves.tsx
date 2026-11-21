"use client";

import { motion, useReducedMotion } from "framer-motion";

const leaves = [
  { left: "6%", top: "18%", size: 46, delay: 0, duration: 14, rotate: -20, opacity: 0.55 },
  { left: "42%", top: "10%", size: 28, delay: 2, duration: 11, rotate: 30, opacity: 0.45 },
  { left: "78%", top: "22%", size: 38, delay: 1, duration: 16, rotate: 10, opacity: 0.4 },
  { left: "62%", top: "64%", size: 24, delay: 3.5, duration: 12, rotate: -40, opacity: 0.5 },
  { left: "18%", top: "72%", size: 32, delay: 1.5, duration: 15, rotate: 55, opacity: 0.45 },
  { left: "88%", top: "70%", size: 52, delay: 4, duration: 18, rotate: -15, opacity: 0.35 },
  { left: "30%", top: "40%", size: 20, delay: 5, duration: 13, rotate: 70, opacity: 0.35 },
];

function Leaf({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path d="M6 42C6 22 18 8 42 6c-2 22-14 34-36 36Z" fill="currentColor" />
      <path d="M8 40C18 30 26 20 36 12" stroke="rgba(24,54,35,.35)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Gently drifting, rotating leaves layered over the hero image. */
export function FloatingLeaves() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-sage"
          style={{ left: leaf.left, top: leaf.top, opacity: leaf.opacity }}
          initial={{ rotate: leaf.rotate }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -26, 8, -14, 0],
                  x: [0, 14, -10, 6, 0],
                  rotate: [leaf.rotate, leaf.rotate + 18, leaf.rotate - 10, leaf.rotate + 8, leaf.rotate],
                }
          }
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf size={leaf.size} />
        </motion.div>
      ))}
    </div>
  );
}
