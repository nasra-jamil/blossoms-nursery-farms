export type CategorySlug =
  | "indoor-plants"
  | "balcony-plants"
  | "outdoor-plants"
  | "flowering-plants"
  | "trees"
  | "fruit-plants"
  | "succulents-cacti"
  | "herbs-vegetables";

export type Availability = "in-stock" | "low-stock" | "out-of-stock";
export type Maintenance = "Easy" | "Moderate" | "Expert";
export type Placement = "Indoor" | "Balcony" | "Outdoor";

export interface PlantImage {
  src: string;
  alt: string;
}

export interface Plant {
  id: string;
  name: string;
  slug: string;
  botanicalName: string;
  category: CategorySlug;
  price: number;
  /** One-line summary for cards */
  description: string;
  /** Long-form copy for the detail page */
  details: string;
  images: PlantImage[];
  availability: Availability;
  sunlight: string;
  watering: string;
  maintenance: Maintenance;
  size: string;
  placement: Placement[];
  care: string[];
  featured?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: PlantImage;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
  plant: string;
}
