import type { Metadata } from "next";
import { Clock, Mail, MapPin, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { displayPhone, site } from "@/lib/site";
import { generalWhatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name} on WhatsApp or email, or visit our nursery in ${site.city}.`,
  alternates: { canonical: "/contact" },
};

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon | typeof WhatsAppIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-forest/10 bg-white p-7 shadow-soft">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-olive/70 text-forest">
        <Icon size={22} strokeWidth={1.7} />
      </span>
      <h2 className="mt-5 font-display text-2xl text-forest">{title}</h2>
      <div className="mt-2 text-charcoal/70">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title={
          <>
            Let&apos;s grow <em className="text-moss italic">together</em>
          </>
        }
        description="The fastest way to reach us is WhatsApp — send a photo of your space and we'll recommend plants that will love it."
      />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-forest p-8 text-cream sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-sage uppercase">Order & enquiries</p>
              <p className="mt-3 font-display text-4xl sm:text-5xl">{displayPhone()}</p>
              <p className="mt-3 max-w-md text-cream/75">
                Message us to order, check stock, ask about bulk or corporate orders, or get plant-care help.
              </p>
            </div>
            <WhatsAppButton size="lg" tone="cream" label="Chat on WhatsApp" />
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Reveal>
            <Card icon={MapPin} title="Visit the nursery">
              <p>{site.address}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card icon={Clock} title="Opening hours">
              <p>{site.hours}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.16}>
            <Card icon={Mail} title="Email & social">
              <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-forest">
                {site.email}
              </a>
              <div className="mt-4 flex gap-3">
                {[
                  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
                  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
                  { href: generalWhatsappUrl, label: "WhatsApp", Icon: WhatsAppIcon },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-forest/15 text-forest transition-colors hover:bg-forest hover:text-cream"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
