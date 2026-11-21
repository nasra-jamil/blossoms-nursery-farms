import { ArrowRight } from "lucide-react";
import type { Plant } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlantGrid } from "@/components/plants/PlantGrid";

export function FeaturedPlants({ plants }: { plants: Plant[] }) {
  return (
    <section className="bg-olive/35">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Plants"
            title={
              <>
                Loved by our <em className="text-moss italic">plant parents</em>
              </>
            }
            description="Hand-picked favourites from this season's harvest — healthy, well-rooted and ready to move in."
          />
          <Button href="/shop" variant="primary" className="group shrink-0 self-start md:self-auto">
            Shop all plants <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <PlantGrid plants={plants} className="mt-12" />
      </div>
    </section>
  );
}
