import Link from "next/link";
import { Droplets, Gauge, MapPin, Ruler, ShieldCheck, Sun, Truck, type LucideIcon } from "lucide-react";
import type { Category, Plant } from "@/data/types";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { ImageGallery } from "./ImageGallery";
import { DiscountBadge, PriceTag } from "./PriceTag";

function Spec({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-forest/10 bg-white p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-olive/70 text-forest">
        <Icon size={18} strokeWidth={1.7} />
      </span>
      <div>
        <dt className="text-[11px] font-semibold tracking-[0.16em] text-moss uppercase">{label}</dt>
        <dd className="mt-0.5 text-sm leading-snug text-charcoal">{value}</dd>
      </div>
    </div>
  );
}

export function ProductDetails({ plant, category }: { plant: Plant; category: Category }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <Reveal y={16}>
        <ImageGallery images={plant.images} name={plant.name} />
      </Reveal>

      <Reveal delay={0.1} y={16} className="flex flex-col">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/categories/${category.slug}`}
            className="rounded-full bg-olive/70 px-3 py-1 text-xs font-semibold text-forest transition-colors hover:bg-olive"
          >
            {category.name}
          </Link>
          <AvailabilityBadge value={plant.availability} className="border border-forest/10" />
          <DiscountBadge plant={plant} />
        </div>

        <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-forest sm:text-5xl">{plant.name}</h1>
        <p className="mt-2 text-sm text-charcoal/55 italic">{plant.botanicalName}</p>

        <PriceTag plant={plant} size="lg" className="mt-6" />

        <p className="mt-6 text-base leading-relaxed text-charcoal/75">{plant.details}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton plant={plant} size="lg" className="sm:flex-1" />
        </div>
        <p className="mt-3 text-xs text-charcoal/55">
          Opens WhatsApp with your order details pre-filled. We&apos;ll confirm availability, pot options and delivery
          charges before you pay.
        </p>

        <dl className="mt-10 grid gap-3 sm:grid-cols-2">
          <Spec icon={Ruler} label="Plant size" value={plant.size} />
          <Spec icon={Sun} label="Sunlight" value={plant.sunlight} />
          <Spec icon={Droplets} label="Watering" value={plant.watering} />
          <Spec icon={Gauge} label="Maintenance" value={plant.maintenance} />
          <div className="sm:col-span-2">
            <Spec icon={MapPin} label="Suitable placement" value={plant.placement.join(" · ")} />
          </div>
        </dl>

        <ul className="mt-8 grid gap-3 text-sm text-charcoal/70 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-moss" /> Healthy-plant guarantee on arrival
          </li>
          <li className="flex items-center gap-2">
            <Truck size={18} className="text-moss" /> Delivered safely across Pakistan
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
