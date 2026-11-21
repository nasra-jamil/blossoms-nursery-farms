"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Star, Truck } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { unsplash } from "@/lib/format";
import { generalWhatsappUrl } from "@/lib/whatsapp";
import { FloatingLeaves } from "./FloatingLeaves";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest-deep">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -z-20">
        <Image
          src={unsplash("1616046229478-9901c5536a45", 2400)}
          alt="Sunlit living room with a sage green wall, round mirror and lush potted plants around a rattan sideboard"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/90 via-forest-deep/60 to-forest-deep/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/80 via-transparent to-forest-deep/30" />

      <FloatingLeaves />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 text-xs font-medium tracking-wide text-cream backdrop-blur-md"
        >
          <Leaf size={14} className="text-sage" />
          Freshly grown in our Lahore nursery
        </motion.p>

        <h1 className="max-w-3xl font-display text-[2.9rem] leading-[0.98] font-light tracking-tight text-cream sm:text-7xl lg:text-[5.5rem]">
          {["Bring Nature", "Closer to Home"].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.2 + i * 0.12 }}
              >
                {i === 1 ? (
                  <>
                    Closer to <em className="font-normal text-sage italic">Home</em>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.55 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
        >
          Discover beautiful plants to transform your home, balcony, and garden into a greener space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.7 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Button href="/shop" variant="light" className="group">
            Explore Plants
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button href={generalWhatsappUrl} external variant="ghost">
            <WhatsAppIcon size={18} /> Chat on WhatsApp
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream/75"
        >
          <li className="flex items-center gap-2">
            <Star size={16} className="fill-sage text-sage" /> Free care guidance with every plant
          </li>
          <li className="flex items-center gap-2">
            <Truck size={16} className="text-sage" /> Delivery across Pakistan
          </li>
        </motion.ul>
      </motion.div>

      <motion.a
        href="#grow"
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute right-8 bottom-10 hidden flex-col items-center gap-3 text-[10px] tracking-[0.3em] text-cream/60 uppercase lg:flex"
      >
        Scroll
        <span className="relative h-14 w-px overflow-hidden bg-cream/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-5 bg-cream"
            animate={{ y: [-20, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
