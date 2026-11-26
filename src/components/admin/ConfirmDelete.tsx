"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";

/**
 * Delete button with an in-page confirmation (no browser confirm() dialogs).
 */
export function ConfirmDelete({
  label,
  onConfirm,
  onDone,
}: {
  label: string;
  onConfirm: () => Promise<ActionResult>;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        aria-label={`Delete ${label}`}
        className="flex size-9 items-center justify-center rounded-lg text-red-700 transition-colors hover:bg-red-50"
      >
        <Trash2 size={16} />
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
          <button type="button" aria-label="Cancel" className="absolute inset-0 bg-charcoal/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift">
            <h2 id="confirm-title" className="font-display text-xl text-forest">
              Delete “{label}”?
            </h2>
            <p className="mt-2 text-sm text-charcoal/65">This removes it from the website immediately and can’t be undone.</p>
            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="min-h-10 rounded-full border border-forest/20 px-4 text-sm font-semibold text-forest">
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const res = await onConfirm();
                    if (res.ok) {
                      setOpen(false);
                      onDone?.();
                    } else setError(res.error);
                  })
                }
                className="min-h-10 rounded-full bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
