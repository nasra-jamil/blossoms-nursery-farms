"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/format";
import { generalWhatsappUrl } from "@/lib/whatsapp";
import { LogoMark, WhatsAppIcon } from "@/components/ui/icons";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The homepage hero is dark, so the bar starts transparent with light text there.
  const overHero = pathname === "/" && !scrolled && !open;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled || open || pathname !== "/"
            ? "border-b border-forest/10 bg-cream/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
            <LogoMark size={34} />
            <span className="leading-none">
              <span className={cn("block font-display text-xl tracking-tight", overHero ? "text-cream" : "text-forest")}>
                {site.name}
              </span>
              <span
                className={cn(
                  "block text-[10px] font-semibold tracking-[0.28em] uppercase",
                  overHero ? "text-cream/70" : "text-moss",
                )}
              >
                {site.tagline}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    overHero ? "text-cream/85 hover:text-cream" : "text-charcoal/75 hover:text-forest",
                    isActive(link.href) && (overHero ? "text-cream" : "text-forest"),
                  )}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn("absolute inset-0 -z-10 rounded-full", overHero ? "bg-cream/15" : "bg-olive/70")}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <motion.a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors sm:inline-flex",
                overHero ? "bg-cream text-forest hover:bg-white" : "bg-forest text-cream hover:bg-forest-deep",
              )}
            >
              <WhatsAppIcon size={18} />
              WhatsApp Order
            </motion.a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden",
                overHero ? "text-cream hover:bg-cream/10" : "text-forest hover:bg-olive/60",
              )}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-cream lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              className="flex flex-col gap-1 px-6 pt-6"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block border-b border-forest/10 py-4 font-display text-3xl",
                      isActive(link.href) ? "text-forest" : "text-charcoal/70",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="pt-8">
                <a
                  href={generalWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-forest font-semibold text-cream"
                >
                  <WhatsAppIcon size={20} /> Order on WhatsApp
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
