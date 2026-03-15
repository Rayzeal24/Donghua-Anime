"use client";

import { ContentCard } from "./content-card";
import { Film } from "lucide-react";
import type { ContentCardData } from "@/types";

interface ContentGridProps {
  contents: ContentCardData[];
  emptyMessage?: string;
}

export function ContentGrid({ contents, emptyMessage }: ContentGridProps) {
  if (contents.length === 0 && emptyMessage) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03]">
          <Film className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid-stagger grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
