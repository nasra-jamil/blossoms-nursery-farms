import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server/auth";
import { adminConfigured } from "@/lib/server/session";
import { site } from "@/lib/site";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="grain flex min-h-dvh items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-forest/10 bg-white p-8 shadow-lift">
        <p className="text-xs font-semibold tracking-[0.22em] text-moss uppercase">{site.name}</p>
        <h1 className="mt-2 font-display text-3xl text-forest">Admin sign in</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            Admin access is turned off. Add <code className="font-semibold">ADMIN_PASSWORD</code> to{" "}
            <code className="font-semibold">.env.local</code> and restart the server.
          </p>
        )}
      </div>
    </div>
  );
}
