import { unsplash } from "@/lib/format";
import type { PlantImage } from "./types";

export type ServiceIcon = "landscape" | "lawn" | "farmhouse" | "society" | "office" | "maintenance";

export interface Service {
  slug: string;
  title: string;
  /** One line for cards */
  short: string;
  description: string;
  points: string[];
  icon: ServiceIcon;
  image: PlantImage;
}

/** Sample service catalogue — edit freely; shape is CMS-ready like plants. */
export const services: Service[] = [
  {
    slug: "landscaping",
    title: "Landscape Design & Installation",
    short: "Complete garden design — from layout and hardscape to planting.",
    description:
      "We plan and build gardens that suit your space, budget and Punjab's climate — hedges, flower beds, pathways, focal trees and seasonal colour, all planted by our own team.",
    points: ["Site visit & layout plan", "Hedges, borders & flower beds", "Pathways, edging & focal trees", "Plants supplied from our Pattoki nursery"],
    icon: "landscape",
    image: {
      src: unsplash("1600585154340-be6161a56a0c", 1400),
      alt: "Contemporary villa with floor-to-ceiling glass, a landscaped lawn and a mature shade tree",
    },
  },
  {
    slug: "lawn-development",
    title: "Lawn Development",
    short: "New lawns, grass laying and lawn renovation for homes and offices.",
    description:
      "Lush, even lawns built properly from the ground up — soil levelling, preparation and grass laying with varieties chosen for sun, shade and foot traffic.",
    points: ["Soil levelling & preparation", "Grass laying (Dhaka, Mexican, Korean & more)", "Lawn renovation & re-turfing", "Fertiliser & watering schedule"],
    icon: "lawn",
    image: {
      src: unsplash("1600047509807-ba8f99d2cdde", 1400),
      alt: "Modern house facade with a freshly laid green lawn and stepping-stone path",
    },
  },
  {
    slug: "farmhouse-greening",
    title: "Farmhouse Greening",
    short: "Large-scale planting for farmhouses, estates and boundary walls.",
    description:
      "From boundary plantation and fruit orchards to poolside gardens and driveways, we green large plots with hardy, fast-establishing plants delivered direct from our farm.",
    points: ["Boundary & screening plantation", "Fruit orchards (citrus, guava, mango)", "Driveway & poolside gardens", "Bulk plant supply at farm rates"],
    icon: "farmhouse",
    image: {
      src: unsplash("1613977257363-707ba9348227", 1400),
      alt: "Modern white farmhouse villa with a pool, palm trees and manicured lawn",
    },
  },
  {
    slug: "housing-societies",
    title: "Housing Societies & Parks",
    short: "Avenue trees, parks and green belts for societies and developers.",
    description:
      "We partner with housing societies, developers and institutions on avenue plantation, parks, roundabouts and green belts — with bulk supply and planting crews.",
    points: ["Avenue & roadside tree plantation", "Parks, green belts & roundabouts", "Bulk supply with on-site delivery", "Seasonal plantation drives"],
    icon: "society",
    image: {
      src: unsplash("1600607688969-a5bfcd646154", 1400),
      alt: "Modern home with a large shade tree and green lawn in a landscaped plot",
    },
  },
  {
    slug: "indoor-plantscaping",
    title: "Office & Indoor Plantscaping",
    short: "Plant styling for offices, cafés, showrooms and homes.",
    description:
      "Bring life indoors with the right plants and planters for your light levels — styled, installed and optionally maintained by our team.",
    points: ["Plant & planter selection", "Low-light & air-purifying plants", "Installation & styling", "Optional monthly upkeep"],
    icon: "office",
    image: {
      src: unsplash("1618221195710-dd6b41faaea6", 1400),
      alt: "Contemporary lounge styled with indoor plants and warm modern furniture",
    },
  },
  {
    slug: "garden-maintenance",
    title: "Garden Maintenance",
    short: "Regular care visits — pruning, feeding, mowing and plant health.",
    description:
      "Keep your garden looking its best all year with scheduled visits from our gardeners: mowing, pruning, feeding, pest control and seasonal replanting.",
    points: ["Weekly or monthly visits", "Mowing, pruning & hedge trimming", "Fertiliser & pest control", "Seasonal flower replanting"],
    icon: "maintenance",
    image: {
      src: unsplash("1590820292118-e256c3ac2676", 1400),
      alt: "Lawn mower on a neatly striped green lawn",
    },
  },
];
