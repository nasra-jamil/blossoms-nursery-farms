import Link from "next/link";
import { cn } from "@/lib/format";

export const inputClass =
  "h-11 w-full rounded-xl border border-forest/15 bg-white px-3.5 text-sm outline-none transition placeholder:text-charcoal/35 focus:border-forest/40 focus:ring-4 focus:ring-olive aria-[invalid=true]:border-red-500";

export const textareaClass =
  "w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-charcoal/35 focus:border-forest/40 focus:ring-4 focus:ring-olive aria-[invalid=true]:border-red-500";

export function Field({
  label,
  hint,
  error,
  children,
  className,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-charcoal/85">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-charcoal/50">{hint}</p>
      ) : null}
    </div>
  );
}

export function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-forest/10 bg-white p-5 shadow-soft sm:p-6", className)}>
      {title && <h2 className="mb-4 font-display text-xl text-forest">{title}</h2>}
      {children}
    </section>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-forest sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-charcoal/60">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-cream hover:bg-forest-deep"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
