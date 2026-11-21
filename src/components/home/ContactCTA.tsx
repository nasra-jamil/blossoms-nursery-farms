import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { unsplash } from "@/lib/format";

export function ContactCTA() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-forest">
        <Image
          src={unsplash("1470058869958-2a77ade41c02", 2000)}
          alt="Dense tropical foliage with large green leaves"
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/40" />
        <div className="relative grid gap-10 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-16 lg:py-24">
          <div>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-balance text-cream sm:text-5xl lg:text-6xl">
              Ready to Make Your Space <em className="text-sage italic">Greener?</em>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-cream/80">
              Find your perfect plant and let us help you get started.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <WhatsAppButton
              size="lg"
              label="Chat on WhatsApp"
              tone="cream"
            />
            <Button href="/shop" variant="ghost" className="min-h-14 px-8 text-base">
              Browse the shop <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
