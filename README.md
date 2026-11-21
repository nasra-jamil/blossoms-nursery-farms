# Blossoms Nursery Farms — Plant Nursery Website (Pattoki)

A premium, responsive plant nursery storefront built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion** and **Lucide** icons. All purchases happen over **WhatsApp**. There's no cart and no checkout.

## Getting started

```bash
npm install
cp .env.example .env.local   # then set your WhatsApp number
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number in international format, digits only, e.g. `923001234567` |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, sitemap, OG tags and product links in WhatsApp messages |

## Routes

| Route | Description |
| --- | --- |
| `/` | Hero, scroll-driven seed-to-plant animation, categories, featured plants, why us, inspiration, testimonials, CTA |
| `/shop` | Full catalogue with search, category and availability filters, and price sort. Filter state lives in the URL (`?category=&availability=&sort=&q=`). On mobile the filters open in a bottom-sheet drawer. |
| `/categories`, `/categories/[slug]` | SEO-friendly category pages (statically generated) |
| `/plants/[slug]` | Product detail page: gallery with hover zoom, specs, care guide, related plants, Product JSON-LD |
| `/about`, `/contact` | Brand pages |
| `/sitemap.xml`, `/robots.txt` | Generated from the catalogue |

## Project structure

```
src/
  app/                 routes, layout, page transitions (template.tsx), sitemap, robots
  components/
    layout/            Navbar, Footer, Providers (reduced-motion config)
    home/              HeroSection, FloatingLeaves, PlantGrowingAnimation, CategorySection,
                       CategoryCard, CategoryGrid, FeaturedPlants, WhyChooseUs,
                       GreenInspiration, Testimonials, ContactCTA
    plants/            PlantCard, PlantGrid, ProductFilters, ShopClient, ProductDetails,
                       ImageGallery, AvailabilityBadge
    ui/                Button, WhatsAppButton, FloatingWhatsApp, Reveal, SectionHeading, PageHeader, icons
  data/                types + sample plants, categories, testimonials
  lib/
    catalog.ts         async data-access layer (the only file that touches data)
    whatsapp.ts        wa.me URL + pre-filled message builders
    site.ts            brand name, contact details, nav links
    image-loader.ts    next/image loader that lets Unsplash's CDN serve responsive sizes
```

### Moving to a CMS or database

Pages only call the async functions in `src/lib/catalog.ts` (`getAllPlants`, `getPlantBySlug`, …). To use Sanity, Contentful, Supabase or another source, make those functions fetch and map to the `Plant` and `Category` types in `src/data/types.ts`. Nothing else needs to change. If images move to a CMS, update `src/lib/image-loader.ts` (or remove `loader: "custom"` from `next.config.ts` and add the CMS host to `remotePatterns`).

## WhatsApp ordering

Every purchase button links to `https://wa.me/<NUMBER>?text=<encoded message>`. Example message:

> Hi! I am interested in ordering Monstera Deliciosa (Rs. 3,500). Could you please share its availability and delivery details?
> https://your-site/plants/monstera-deliciosa

Out-of-stock plants change their button to "Ask on WhatsApp". A floating WhatsApp button appears on every page.

## Motion and accessibility

- Framer Motion respects the OS "reduce motion" setting through `MotionConfig reducedMotion="user"`. When it's on, the plant-growing section shows the fully grown plant without the scroll-pinned sequence.
- Semantic landmarks, a skip link, labelled controls, ≥44px tap targets and descriptive alt text on every image.

## Before launch: replace the sample content

- **Testimonials** in `src/data/testimonials.ts` are placeholders. Replace them with real customer reviews.
- **Contact details** (address, email, social links) in `src/lib/site.ts` are placeholders.
- **Photos** are Unsplash stock images under the Unsplash License. Swap in your own nursery photography where you can. The mango sapling uses a fruit photo, not a photo of the plant.
- **Prices, stock and plant data** are realistic samples, not real inventory.
