import { cn } from "@/lib/format";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]",
            light ? "text-olive" : "text-moss",
          )}
        >
          <span className={cn("h-px w-8", light ? "bg-olive/60" : "bg-moss/50")} />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl",
          light ? "text-cream" : "text-forest",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", light ? "text-cream/75" : "text-charcoal/70")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
