"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Play, Clock } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Episode } from "@prisma/client";

interface EpisodeListProps {
  episodes: Episode[];
  contentSlug: string;
}

export function EpisodeList({ episodes, contentSlug }: EpisodeListProps) {
  const locale = useLocale();
  const t = useTranslations("content");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-primary" />
        <h3 className="text-xl font-bold">
          {t("episodes")} ({episodes.length})
        </h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {episodes
          .sort((a, b) => a.number - b.number)
          .map((ep) => (
            <Link
              key={ep.id}
              href={`/${locale}/watch/${ep.id}`}
              className="card-press group flex items-center gap-3.5 rounded-2xl border border-white/[0.04] bg-card/40 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/[0.04]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10">
                <Play className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">
                  {t("episode")} {ep.number}
                  {ep.title && ` — ${ep.title}`}
                </p>
                {ep.duration && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/60">
                    <Clock className="h-3 w-3" />
                    {formatDuration(ep.duration)}
                  </p>
                )}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
