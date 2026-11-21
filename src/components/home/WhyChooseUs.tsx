"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck, HandCoins, HeartHandshake, PackageCheck, Sprout, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem } from "@/components/ui/Reveal";
import { unsplash } from "@/lib/format";

const features: { icon: LucideIcon | typeof WhatsAppIcon; title: string; text: string }[] = [
  { icon: Sprout, title: "Healthy & Fresh Plants", text: "Grown and hardened in our own nursery, then checked leaf-by-leaf before dispatch." },
  { icon: BadgeCheck, title: "Carefully Selected Varieties", text: "Only plants proven to thrive in Pakistan's climate make it into our collection." },
  { icon: HandCoins, title: "Affordable Prices", text: "Nursery-direct pricing with no middlemen — premium plants without the premium markup." },
  { icon: HeartHandshake, title: "Expert Plant Care Guidance", text: "Personal care tips with every order, plus friendly help whenever you need it." },
  { icon: PackageCheck, title: "Safe Packaging", text: "Secure, breathable packing that keeps soil in place and leaves unbruised in transit." },
  { icon: WhatsAppIcon, title: "Convenient WhatsApp Ordering", text: "No accounts, no checkout forms. Just send a message and we’ll take it from there." },
];

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-32">
        <div className="flex flex-col">
          <SectionHeading
            light
            eyebrow="Why Choose Us"
            title={
              <>
                Grown with patience, <em className="text-sage italic">delivered with care</em>
              </>
            }
            description="We're growers first. That means healthier roots, honest advice and plants that settle happily into their new homes."
          />
          <div ref={ref} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
            <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
              <Image
                src={unsplash("1515150144380-bca9f1650ed9", 1400)}
                alt="Fine spray of water from a watering can falling over young green plants"
                fill
                sizes="40vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 sm:gap-5"
        >
          {features.map(({ icon: Icon, title, text }) => (
            <motion.li
              key={title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="group rounded-[1.5rem] border border-cream/10 bg-cream/[0.04] p-6 transition-colors duration-500 hover:border-sage/40 hover:bg-cream/[0.08] sm:p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-sage/15 text-sage transition-colors duration-500 group-hover:bg-sage group-hover:text-forest">
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
