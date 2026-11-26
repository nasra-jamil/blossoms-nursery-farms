export const site = {
  name: "Blossoms Nursery Farm",
  /** Short form used in the logo lockup */
  shortName: "BLOSSOMS",
  tagline: "Nursery Farm Pattoki",
  city: "Pattoki",
  description:
    "Blossoms Nursery Farm is a plant nursery in Pattoki — Pakistan's city of flowers — bringing healthy indoor, balcony, outdoor, flowering and fruit plants to homes across Pakistan. Browse our collection and order easily on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blossoms-nursery-farm.vercel.app/",
  whatsappNumber: ("923024452109").replace(/\D/g, ""),
  email: "blossomnurseryfarm@gmail.com",
  address: "Pattoki, District Kasur, Punjab, Pakistan",
  hours: "Mon – Sun, 8:00 am – 10:00 pm",
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
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];
