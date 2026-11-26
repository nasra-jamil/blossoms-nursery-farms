"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderTree, LayoutDashboard, LogOut, Menu, Sprout, X } from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui/icons";
import { cn } from "@/lib/format";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/plants", label: "Plants", icon: Sprout },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-2">
        <LogoMark size={34} />
        <span className="leading-tight">
          <span className="block font-display text-lg text-cream">Blossoms</span>
          <span className="block text-[10px] font-semibold tracking-[0.24em] text-sage uppercase">Admin</span>
        </span>
      </Link>
      <nav aria-label="Admin" className="mt-8 flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href, exact) ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              isActive(href, exact) ? "bg-cream text-forest" : "text-cream/75 hover:bg-cream/10 hover:text-cream",
            )}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-cream/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-cream/75 hover:bg-cream/10 hover:text-cream"
        >
          <ExternalLink size={18} /> View website
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-cream/75 hover:bg-cream/10 hover:text-cream"
          >
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-[#f3f2ea] lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 bg-forest-deep p-5 lg:block">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-forest-deep px-4 text-cream lg:hidden">
        <span className="font-display text-lg">Blossoms Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="flex size-10 items-center justify-center rounded-full hover:bg-cream/10"
        >
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-charcoal/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72 bg-forest-deep p-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close admin menu"
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full text-cream hover:bg-cream/10"
            >
              <X size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</div>
    </div>
  );
}
