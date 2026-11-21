import type { Availability } from "@/data/types";
import { cn } from "@/lib/format";

const config: Record<Availability, { label: string; dot: string; className: string }> = {
  "in-stock": { label: "In stock", dot: "bg-emerald-600", className: "bg-cream/95 text-forest" },
  "low-stock": { label: "Only a few left", dot: "bg-amber-500", className: "bg-cream/95 text-amber-800" },
  "out-of-stock": { label: "Out of stock", dot: "bg-charcoal/40", className: "bg-cream/95 text-charcoal/60" },
};

export function AvailabilityBadge({ value, className }: { value: Availability; className?: string }) {
  const c = config[value];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur",
        c.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  );
}

export const availabilityLabel = (v: Availability) => config[v].label;
