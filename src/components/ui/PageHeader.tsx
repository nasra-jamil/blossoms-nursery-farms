import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function PageHeader({
  title,
  description,
  crumbs,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <header className="grain relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -top-10 -right-16 w-72 animate-sway text-olive sm:w-96"
      >
        <path fill="currentColor" d="M100 195C100 115 115 60 190 10c-10 90-40 150-90 185Z" />
        <path fill="currentColor" opacity=".6" d="M100 195c0-60-10-100-70-140 5 70 30 115 70 140Z" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-charcoal/55">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-forest">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-forest">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight text-forest sm:text-6xl">
            {title}
          </h1>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal/70">{description}</p>}
        </Reveal>
        {children}
      </div>
    </header>
  );
}
