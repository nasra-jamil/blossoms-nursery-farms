import { unsplash } from "@/lib/format";
import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "indoor-plants",
    name: "Indoor Plants",
    description: "Lush, low-fuss greens that purify the air and soften every room.",
    image: {
      src: unsplash("1545241047-6083a3684587", 1000),
      alt: "Monstera plant in a white pot on a wooden stool beside a white chair",
    },
  },
  {
    slug: "balcony-plants",
    name: "Balcony Plants",
    description: "Hardy trailers and potted beauties for sunny ledges and terraces.",
    image: {
      src: unsplash("1621512367176-03782e847fa2", 1000),
      alt: "Terracotta pots with leafy plants and succulents arranged on a blue table outdoors",
    },
  },
  {
    slug: "outdoor-plants",
    name: "Outdoor Plants",
    description: "Statement shrubs and topiaries to shape your garden and lawn.",
    image: {
      src: unsplash("1557429287-b2e26467fc2b", 1000),
      alt: "Cottage with a colourful flower garden and green lawn under a blue sky",
    },
  },
  {
    slug: "flowering-plants",
    name: "Flowering Plants",
    description: "Seasonal colour and fragrance — roses, orchids, lilies and more.",
    image: {
      src: unsplash("1490750967868-88aa4486c946", 1000),
      alt: "Bright orange flowers blooming against a clear blue sky",
    },
  },
  {
    slug: "trees",
    name: "Trees",
    description: "Bonsai, ficus and shade trees grown slowly for strong roots.",
    image: {
      src: unsplash("1502082553048-f009c37129b9", 1000),
      alt: "A broad, mature tree with a wide green canopy standing in a grassy field",
    },
  },
  {
    slug: "fruit-plants",
    name: "Fruit Plants",
    description: "Grafted citrus, guava and mango saplings for a home harvest.",
    image: {
      src: unsplash("1547514701-42782101795e", 1000),
      alt: "Fresh oranges with green leaves still attached to the stem",
    },
  },
  {
    slug: "succulents-cacti",
    name: "Succulents & Cacti",
    description: "Sculptural, drought-tolerant plants that thrive on neglect.",
    image: {
      src: unsplash("1520302630591-fd1c66edc19d", 1000),
      alt: "A dense arrangement of colourful succulents and echeveria rosettes",
    },
  },
  {
    slug: "herbs-vegetables",
    name: "Herbs & Vegetable Plants",
    description: "Kitchen-garden favourites — mint, basil, tomatoes and more.",
    image: {
      src: unsplash("1591857177580-dc82b9ac4e1e", 1000),
      alt: "Raised vegetable garden beds full of leafy greens",
    },
  },
];

export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
