"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface ContentFiltersProps {
  genres: Genre[];
}

export function ContentFilters({ genres }: ContentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("catalogue.filters");

  const currentGenre = searchParams.get("genre") || "";
  const currentType = searchParams.get("type") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/${locale}/catalogue?${params.toString()}`);
    },
    [searchParams, router, locale]
  );

  const selectClass =
    "h-10 cursor-pointer rounded-xl border border-white/[0.06] bg-card px-3.5 text-sm text-foreground transition-all duration-200 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-white/10";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.04] bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
      </div>

      <select value={currentGenre} onChange={(e) => updateFilter("genre", e.target.value)} className={selectClass}>
        <option value="">{t("genre")}</option>
        {genres.map((g) => (
          <option key={g.id} value={g.slug}>{g.name}</option>
        ))}
      </select>

      <select value={currentType} onChange={(e) => updateFilter("type", e.target.value)} className={selectClass}>
        <option value="">{t("type")}</option>
        <option value="DONGHUA">Donghua</option>
        <option value="ANIME">Anime</option>
        <option value="FILM">Film</option>
        <option value="OVA">OVA</option>
        <option value="ONA">ONA</option>
      </select>

      <select value={currentStatus} onChange={(e) => updateFilter("status", e.target.value)} className={selectClass}>
        <option value="">{t("status")}</option>
        <option value="ONGOING">En cours</option>
        <option value="COMPLETED">Termine</option>
        <option value="UPCOMING">A venir</option>
      </select>

      <select value={currentSort} onChange={(e) => updateFilter("sort", e.target.value)} className={selectClass}>
        <option value="newest">{t("sortOptions.newest")}</option>
        <option value="oldest">{t("sortOptions.oldest")}</option>
        <option value="titleAsc">{t("sortOptions.titleAsc")}</option>
        <option value="titleDesc">{t("sortOptions.titleDesc")}</option>
      </select>
    </div>
  );
}
