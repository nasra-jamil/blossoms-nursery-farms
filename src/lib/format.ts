const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export function formatPrice(value: number) {
  return `Rs. ${pkr.format(value)}`;
}

export const MAX_DISCOUNT = 90;

/** Normalises a stored discount to a whole number between 0 and MAX_DISCOUNT. */
export function discountOf(plant: { discountPercent?: number }) {
  const d = Math.round(plant.discountPercent ?? 0);
  return Number.isFinite(d) ? Math.min(Math.max(d, 0), MAX_DISCOUNT) : 0;
}

/**
 * "Sale" is an automatic category: every plant with a discount. Its slug is
 * reserved so an admin-made category can't clash with it.
 */
export const SALE_SLUG = "sale";
export const isOnSale = (plant: { discountPercent?: number }) => discountOf(plant) > 0;

/** The price the customer pays after any discount, rounded to whole rupees. */
export function finalPrice(plant: { price: number; discountPercent?: number }) {
  return Math.round((plant.price * (100 - discountOf(plant))) / 100);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Builds an optimisable Unsplash URL; next/image handles responsive sizing. */
export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}
