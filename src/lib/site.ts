export const site = {
  name: "Sabzaar",
  tagline: "Plant Nursery",
  description:
    "Sabzaar is a premium plant nursery bringing healthy indoor, balcony, outdoor, flowering and fruit plants to homes across Pakistan. Browse our collection and order easily on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567").replace(/\D/g, ""),
  email: "hello@sabzaar.pk",
  address: "Plot 14, Nursery Road, Lahore, Pakistan",
  hours: "Mon – Sat, 9:00 am – 7:00 pm",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
};

/** Formats the configured WhatsApp number for display, e.g. +92 300 1234567 */
export function displayPhone(num = site.whatsappNumber) {
  if (num.startsWith("92") && num.length === 12) {
    return `+92 ${num.slice(2, 5)} ${num.slice(5)}`;
  }
  return `+${num}`;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop Plants" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];
