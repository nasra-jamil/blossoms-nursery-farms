"use client";

/**
 * next/image loader. Unsplash (imgix) resizes and serves AVIF/WebP from its own
 * CDN, so we hand the requested width straight to it instead of proxying large
 * originals through the Next.js optimiser. Other sources fall back to their
 * original URL — swap this for your CMS's loader when integrating one.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", String(Math.min(width, 2400)));
    url.searchParams.set("q", String(quality ?? 75));
    return url.toString();
  }
  return src;
}
