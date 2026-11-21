import Link from "next/link";
import { Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grain flex min-h-[80svh] flex-col items-center justify-center px-4 pt-24 text-center">
      <Sprout size={56} strokeWidth={1.2} className="text-sage" />
      <h1 className="mt-6 font-display text-5xl text-forest">This page hasn&apos;t sprouted yet</h1>
      <p className="mt-4 max-w-md text-charcoal/65">
        The page you&apos;re looking for may have moved. Let&apos;s get you back to the greenery.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-cream">
          Go home
        </Link>
        <Link href="/shop" className="inline-flex min-h-12 items-center rounded-full border border-forest/25 px-6 text-sm font-semibold text-forest">
          Shop plants
        </Link>
      </div>
    </section>
  );
}
