import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getOdyseeEmbedUrl(odyseeUrl: string): string {
  if (odyseeUrl.includes("/$/embed/")) return odyseeUrl;

  try {
    const url = new URL(odyseeUrl);
    const path = url.pathname.replace(/^\//, "");
    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `https://odysee.com/$/embed/${parts[0]}/${parts[1]}`;
    }
  } catch {
    // fallback for non-URL strings
  }

  const cleaned = odyseeUrl.replace(/https?:\/\/odysee\.com\/?/, "");
  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `https://odysee.com/$/embed/${parts[0]}/${parts[1]}`;
  }
  return odyseeUrl;
}

export function getProgressPercent(progress: number, duration: number): number {
  if (!duration) return 0;
  return Math.min(Math.round((progress / duration) * 100), 100);
}
