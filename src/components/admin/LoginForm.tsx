"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-charcoal/80">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          autoFocus
          className="mt-1.5 h-12 w-full rounded-xl border border-forest/15 bg-cream/50 px-4 text-sm outline-none focus:border-forest/40 focus:ring-4 focus:ring-olive"
        />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-cream transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        <Lock size={16} /> {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
