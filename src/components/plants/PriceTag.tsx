import type { Plant } from "@/data/types";
import { cn, discountOf, finalPrice, formatPrice } from "@/lib/format";

type Props = {
  plant: Pick<Plant, "price" | "discountPercent">;
  size?: "md" | "lg";
  className?: string;
};

/** Current price; when discounted, also the struck-through original and the saving. */
export function PriceTag({ plant, size = "md", className }: Props) {
  const d = discountOf(plant);
  const now = finalPrice(plant);
  const lg = size === "lg";

  if (!d) {
    return (
      <p className={cn("font-semibold text-charcoal", lg ? "text-3xl" : "text-base sm:text-lg", className)}>
        {formatPrice(plant.price)}
      </p>
    );
  }

  return (
    <div className={className}>
      <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", lg && "gap-x-3")}>
        <span className="sr-only">Sale price</span>
        <span className={cn("font-semibold text-rose-700", lg ? "text-3xl" : "text-base sm:text-lg")}>
          {formatPrice(now)}
        </span>
        <span className="sr-only">, was</span>
        <s className={cn("text-charcoal/45", lg ? "text-lg" : "text-xs sm:text-sm")}>{formatPrice(plant.price)}</s>
        {lg && (
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">{d}% off</span>
        )}
      </p>
      {lg && <p className="mt-1.5 text-sm text-charcoal/60">You save {formatPrice(plant.price - now)}</p>}
    </div>
  );
}

/** Corner ribbon for product images. */
export function DiscountBadge({ plant, className }: { plant: Pick<Plant, "discountPercent">; className?: string }) {
  const d = discountOf(plant);
  if (!d) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm",
        className,
      )}
    >
      {d}% OFF
    </span>
  );
}
