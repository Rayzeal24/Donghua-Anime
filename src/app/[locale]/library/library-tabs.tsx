"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ContentGrid } from "@/components/content/content-grid";
import { cn } from "@/lib/utils";
import { Heart, History, PlayCircle } from "lucide-react";
import type { ContentCardData } from "@/types";

interface LibraryTabsProps {
  activeTab: string;
  favoriteContents: ContentCardData[];
  historyContents: ContentCardData[];
  continueContents: ContentCardData[];
}

const tabIcons: Record<string, React.ReactNode> = {
  favorites: <Heart className="h-4 w-4" />,
  history: <History className="h-4 w-4" />,
  continue: <PlayCircle className="h-4 w-4" />,
};

export function LibraryTabs({
  activeTab,
  favoriteContents,
  historyContents,
  continueContents,
}: LibraryTabsProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("library");

  const tabs = [
    { key: "favorites", label: t("tabs.favorites") },
    { key: "history", label: t("tabs.history") },
    { key: "continue", label: t("tabs.continueWatching") },
  ];

  const switchTab = (key: string) => {
    router.push(`/${locale}/library?tab=${key}`);
  };

  const contentsMap: Record<string, ContentCardData[]> = {
    favorites: favoriteContents,
    history: historyContents,
    continue: continueContents,
  };

  const emptyMap: Record<string, string> = {
    favorites: t("empty.favorites"),
    history: t("empty.history"),
    continue: t("empty.continueWatching"),
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-1 rounded-2xl border border-white/[0.04] bg-card/50 p-1.5 backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              activeTab === tab.key
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            {tabIcons[tab.key]}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <ContentGrid
        contents={contentsMap[activeTab] || []}
        emptyMessage={emptyMap[activeTab]}
      />
    </div>
  );
}
