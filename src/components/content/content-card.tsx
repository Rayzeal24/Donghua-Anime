"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { Play } from "lucide-react";
import type { ContentCardData } from "@/types";

interface ContentCardProps {
  content: ContentCardData;
}

export function ContentCard({ content }: ContentCardProps) {
  const locale = useLocale();
  const t = useTranslations("content");

  const statusVariant =
    content.status === "ONGOING"
      ? "success"
      : content.status === "COMPLETED"
        ? "default"
        : ("warning" as const);

  const statusLabel =
    content.status === "ONGOING"
      ? t("ongoing")
      : content.status === "COMPLETED"
        ? t("completed")
        : t("upcoming");

  const episodeCount = content.episodes?.length || content.totalEpisodes || 0;

  return (
    <Link
      href={`/${locale}/content/${content.slug}`}
      className="card-press group relative flex flex-col overflow-hidden rounded-2xl"
    >
      {/* Image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-card ring-1 ring-white/[0.04] transition-all duration-500 group-hover:ring-primary/20 group-hover:shadow-xl group-hover:shadow-primary/[0.08]">
        <SafeImage
          src={content.coverImage}
          alt={content.title}
          fill
          className="transition-all duration-700 ease-out group-hover:scale-[1.08]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
        />

        {/* Permanent bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/[0.08]" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
          <div className="flex h-14 w-14 -translate-y-2 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/30 transition-all duration-400 group-hover:translate-y-0 group-hover:scale-100">
            <Play className="ml-0.5 h-6 w-6 text-white" fill="white" />
          </div>
        </div>

        {/* Top badges - always visible */}
        {episodeCount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
              {episodeCount} ep.
            </span>
          </div>
        )}

        {/* Bottom badges */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <Badge variant={statusVariant} className="text-[10px] backdrop-blur-sm">
            {statusLabel}
          </Badge>
          {content.year && (
            <span className="text-[10px] font-medium text-white/70">
              {content.year}
            </span>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="mt-3 space-y-1 px-0.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {content.title}
        </h3>
        {content.titleAlt && (
          <p className="line-clamp-1 text-[11px] text-muted-foreground/80">
            {content.titleAlt}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
          {content.genres.slice(0, 2).map((g, i) => (
            <span key={g.genre.slug}>
              {i > 0 && <span className="mr-1.5">·</span>}
              {g.genre.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
