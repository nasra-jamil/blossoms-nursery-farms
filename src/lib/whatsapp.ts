import { site } from "./site";
import type { Plant } from "@/data/types";
import { formatPrice } from "./format";

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function plantOrderMessage(plant: Pick<Plant, "name" | "price" | "slug">) {
  return (
    `Hi! I am interested in ordering ${plant.name} (${formatPrice(plant.price)}). ` +
    `Could you please share its availability and delivery details?\n\n` +
    `${site.url}/plants/${plant.slug}`
  );
}

export function plantOrderUrl(plant: Pick<Plant, "name" | "price" | "slug">) {
  return whatsappUrl(plantOrderMessage(plant));
}

export function serviceQuoteUrl(serviceTitle: string) {
  return whatsappUrl(
    `Hi! I'm interested in your ${serviceTitle} service. Could you please share details and a quote? ` +
      `My location / plot size: `,
  );
}

export const generalWhatsappUrl = whatsappUrl(
  "Hi! I'd love some help choosing the right plants for my space.",
);
