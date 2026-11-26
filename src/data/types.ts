/** Category slugs are managed in the admin, so any URL-safe string is valid. */
export type CategorySlug = string;

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
  /** Filled in by the data layer for display; not stored. */
  categoryName?: string;
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
