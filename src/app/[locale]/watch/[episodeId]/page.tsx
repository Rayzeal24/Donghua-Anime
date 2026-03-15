import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { OdyseePlayer } from "@/components/player/odysee-player";
import { EpisodeNavigation } from "@/components/player/episode-navigation";
import { WatchTracker } from "./watch-tracker";
import { Tv } from "lucide-react";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const locale = await getLocale();
  const t = await getTranslations("player");
  const session = await auth();

  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      content: {
        include: {
          episodes: { orderBy: { number: "asc" }, select: { id: true, number: true } },
        },
      },
    },
  });

  if (!episode) notFound();

  const episodes = episode.content.episodes;
  const currentIndex = episodes.findIndex((e) => e.id === episodeId);
  const previousEpisodeId = currentIndex > 0 ? episodes[currentIndex - 1].id : null;
  const nextEpisodeId = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1].id : null;

  if (session?.user) {
    await prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId: session.user.id,
          episodeId: episode.id,
        },
      },
      update: { watchedAt: new Date() },
      create: {
        userId: session.user.id,
        contentId: episode.contentId,
        episodeId: episode.id,
      },
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
      {/* Player */}
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/[0.06] shadow-2xl shadow-black/40">
        <OdyseePlayer
          odyseeUrl={episode.odyseeUrl}
          title={`${episode.content.title} - Ep ${episode.number}`}
        />
      </div>

      {/* Navigation */}
      <EpisodeNavigation
        previousEpisodeId={previousEpisodeId}
        nextEpisodeId={nextEpisodeId}
        contentSlug={episode.content.slug}
      />

      {/* Info card */}
      <div className="rounded-2xl border border-white/[0.04] bg-card/60 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Tv className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              {t("nowPlaying")}
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              <Link href={`/${locale}/content/${episode.content.slug}`} className="hover:text-primary transition-colors">
                {episode.content.title}
              </Link>
              <span className="text-muted-foreground"> — Ep. {episode.number}</span>
              {episode.title && (
                <span className="text-muted-foreground/70"> : {episode.title}</span>
              )}
            </h2>
          </div>
        </div>
      </div>

      {session?.user && (
        <WatchTracker episodeId={episode.id} userId={session.user.id} />
      )}
    </div>
  );
}
