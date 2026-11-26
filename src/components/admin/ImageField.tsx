"use client";

import Image from "next/image";
import { ImageUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import type { PlantImage } from "@/data/types";
import { uploadImage } from "@/app/admin/actions";
import { cn } from "@/lib/format";
import { inputClass } from "./ui";

const isPreviewable = (src: string) => /^https:\/\/\S+$/.test(src) || src.startsWith("/uploads/");

/** One image: preview, URL input, upload button and alt text. */
export function ImageField({
  value,
  onChange,
  errors,
  idPrefix,
}: {
  value: PlantImage;
  onChange: (next: PlantImage) => void;
  errors?: { src?: string; alt?: string };
  idPrefix: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (res.ok) onChange({ ...value, src: res.url });
    else setUploadError(res.error);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex gap-3">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-forest/10 bg-olive/30">
        {value.src && isPreviewable(value.src) ? (
          <Image src={value.src} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-[11px] text-charcoal/40">No image</span>
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 size={20} className="animate-spin text-forest" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-src`}
            value={value.src}
            onChange={(e) => onChange({ ...value, src: e.target.value })}
            placeholder="https://… image URL"
            aria-label="Image URL"
            aria-invalid={Boolean(errors?.src)}
            className={cn(inputClass, "min-w-0")}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-forest/20 px-3 text-sm font-medium text-forest hover:bg-olive/40 disabled:opacity-60"
          >
            <ImageUp size={16} /> Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
        <input
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          placeholder="Describe the photo (for accessibility & SEO)"
          aria-label="Image description"
          aria-invalid={Boolean(errors?.alt)}
          className={inputClass}
        />
        {(uploadError || errors?.src || errors?.alt) && (
          <p className="text-xs font-medium text-red-700">{uploadError ?? errors?.src ?? errors?.alt}</p>
        )}
      </div>
    </div>
  );
}
