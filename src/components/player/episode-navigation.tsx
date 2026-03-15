"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EpisodeNavigationProps {
  previousEpisodeId: string | null;
  nextEpisodeId: string | null;
  contentSlug: string;
}

export function EpisodeNavigation({
  previousEpisodeId,
  nextEpisodeId,
  contentSlug,
}: EpisodeNavigationProps) {
  const locale = useLocale();
  const t = useTranslations("player");

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.04] bg-card/40 p-3 backdrop-blur-sm">
      <Link href={`/${locale}/content/${contentSlug}`}>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("backToContent")}</span>
        </Button>
      </Link>
      <div className="flex gap-2">
        {previousEpisodeId ? (
          <Link href={`/${locale}/watch/${previousEpisodeId}`}>
            <Button variant="outline" size="sm" className="gap-1.5 border-white/10">
              <ChevronLeft className="h-4 w-4" />
              {t("previous")}
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            <ChevronLeft className="h-4 w-4" />
            {t("previous")}
          </Button>
        )}
        {nextEpisodeId ? (
          <Link href={`/${locale}/watch/${nextEpisodeId}`}>
            <Button size="sm" className="gap-1.5 glow-sm">
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button size="sm" disabled className="gap-1.5">
            {t("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
