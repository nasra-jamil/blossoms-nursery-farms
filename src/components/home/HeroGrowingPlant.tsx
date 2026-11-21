"use client";

import { AnimatePresence, animate, motion, useReducedMotion, type MotionValue } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/format";
import { useCallback, useEffect, useRef, useState } from "react";
import { GROWTH_STEPS, GrowingPlant, growthStepIndex } from "./GrowingPlant";

const DURATION = 6.5; // seconds from seed to fully grown

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Hero illustration: on load, a seed grows into a full plant inside a light
 * circle. A list of all five stages sits beside it — finished stages stay
 * visible with a check, the current one is highlighted, upcoming ones are faded.
 */
export function HeroGrowingPlant({ circleScale }: { circleScale?: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const controls = useRef<ReturnType<typeof animate> | null>(null);

  const play = useCallback(
    (delay = 0) => {
      controls.current?.stop();
      setProgress(0);
      controls.current = animate(0, 1, {
        duration: DURATION,
        delay,
        ease: "linear", // stage easing is handled inside GrowingPlant
        onUpdate: setProgress,
      });
    },
    [],
  );

  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }
    play(0.6);
    return () => controls.current?.stop();
  }, [reduce, play]);

  const step = growthStepIndex(progress);
  const done = progress >= 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6 lg:justify-end lg:gap-8">     
      <motion.div
        style={circleScale ? { scale: circleScale } : undefined}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
        className="relative aspect-square w-[min(100%,20rem)] shrink-0 overflow-hidden rounded-full bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] lg:w-[min(100%,21rem)]"
      >
        <GrowingPlant
          progress={progress}
          sway
          viewBox="-40 70 480 470"
          className="absolute inset-0 size-full"
          title={`Animated illustration of a plant growing: ${GROWTH_STEPS[step].label}`}
        />
      </motion.div>
    </div>
  );
}
