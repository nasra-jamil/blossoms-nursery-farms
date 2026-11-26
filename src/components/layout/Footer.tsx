import Link from "next/link";
import { Clock, Mail, MapPin } from "lucide-react";
import { getAllCategories } from "@/lib/catalog";
import { displayPhone, navLinks, site } from "@/lib/site";
import { generalWhatsappUrl } from "@/lib/whatsapp";
import { FacebookIcon, InstagramIcon, LogoMark, WhatsAppIcon } from "@/components/ui/icons";

export async function Footer() {
  const categories = await getAllCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest-deep text-cream">
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-24 -bottom-24 w-[28rem] text-cream/[0.04]"
      >
        <path fill="currentColor" d="M200 390C200 230 230 120 380 20c-20 180-80 300-180 370Z" />
        <path fill="currentColor" d="M200 390c0-120-20-200-140-280 10 140 60 230 140 280Z" />
      </svg>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={40} />
            <span className="font-display text-2xl">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            A family-run nursery in Pattoki, growing healthy, hand-selected plants for homes, balconies and gardens across Pakistan.
            Order in a message — we&apos;ll handle the rest.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex size-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-xs font-semibold tracking-[0.22em] text-sage uppercase">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/75 transition-colors hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Plant categories">
          <h3 className="text-xs font-semibold tracking-[0.22em] text-sage uppercase">Categories</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="text-cream/75 transition-colors hover:text-cream">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.22em] text-sage uppercase">Visit & Contact</h3>
          <ul className="mt-5 space-y-4 text-sm text-cream/75">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-sage" />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-3">
              <WhatsAppIcon size={18} className="mt-0.5 shrink-0 text-sage" />
              <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                {displayPhone()}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-sage" />
              <a href={`mailto:${site.email}`} className="hover:text-cream">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-sage" />
              <span>{site.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 pb-24 text-xs text-cream/50 sm:flex-row sm:justify-between sm:px-6 sm:pb-6 lg:px-8">
          <p>© {year} {site.name}, {site.city}. All rights reserved.</p>
          <p>Grown with care in Pattoki · Orders via WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
