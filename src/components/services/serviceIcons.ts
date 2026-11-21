import { Building2, Fence, Flower2, Home, Scissors, Sprout, type LucideIcon } from "lucide-react";
import type { ServiceIcon } from "@/data/services";

export const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  landscape: Flower2,
  lawn: Sprout,
  farmhouse: Home,
  society: Fence,
  office: Building2,
  maintenance: Scissors,
};
