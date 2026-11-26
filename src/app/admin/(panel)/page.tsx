import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, FolderTree, PackageX, Sprout, Star } from "lucide-react";
import { getAllCategories, getAllPlants, getCategoryCounts } from "@/lib/catalog";
import { Card, PageTitle } from "@/components/admin/ui";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [plants, categories, counts] = await Promise.all([getAllPlants(), getAllCategories(), getCategoryCounts()]);
  const lowStock = plants.filter((p) => p.availability !== "in-stock");

  const stats = [
    { label: "Plants", value: plants.length, icon: Sprout, href: "/admin/plants" },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
    { label: "Featured", value: plants.filter((p) => p.featured).length, icon: Star, href: "/admin/plants?filter=featured" },
    { label: "Out of stock", value: plants.filter((p) => p.availability === "out-of-stock").length, icon: PackageX, href: "/admin/plants?filter=out-of-stock" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Manage the plants and categories shown on your website." action={{ href: "/admin/plants/new", label: "+ Add plant" }} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <Icon size={20} className="text-moss" />
            <p className="mt-3 font-condensed text-3xl font-semibold text-forest">{value}</p>
            <p className="text-sm text-charcoal/60">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Needs attention">
          {lowStock.length === 0 ? (
            <p className="text-sm text-charcoal/60">Everything is in stock. 🌿</p>
          ) : (
            <ul className="divide-y divide-forest/10">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-olive/40">
                    <Image src={p.images[0]?.src} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-charcoal">{p.name}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-700">
                      <AlertTriangle size={12} /> {p.availability === "low-stock" ? "Low stock" : "Out of stock"}
                    </span>
                  </span>
                  <Link href={`/admin/plants/${p.id}/edit`} className="text-sm font-semibold text-forest underline underline-offset-4">
                    Update
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Categories">
          <ul className="divide-y divide-forest/10">
            {categories.map((c) => (
              <li key={c.slug} className="flex items-center justify-between py-2.5 text-sm">
                <Link href={`/admin/categories/${c.slug}/edit`} className="font-medium text-charcoal hover:text-forest">
                  {c.name}
                </Link>
                <span className="text-charcoal/55">{counts[c.slug] ?? 0} plants</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-6 text-xs text-charcoal/45">
        Prices shown on the site use PKR, e.g. {formatPrice(2500)}.
      </p>
    </>
  );
}
