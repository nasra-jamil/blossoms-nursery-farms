"use client";

import { usePathname } from "next/navigation";

/** Renders public-site chrome (navbar, footer, floating WhatsApp) everywhere except the admin area. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
