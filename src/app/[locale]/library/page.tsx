import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LibraryTabs } from "./library-tabs";
import { BookOpen } from "lucide-react";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations("library");

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const params = await searchParams;
  const tab = params.tab || "favorites";

  const [favorites, history, progress] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        content: {
          select: {
            id: true, slug: true, title: true, titleAlt: true, coverImage: true,
            type: true, status: true, year: true, totalEpisodes: true,
            genres: { select: { genre: { select: { name: true, slug: true } } } },
            episodes: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      include: {
        content: {
          select: {
            id: true, slug: true, title: true, titleAlt: true, coverImage: true,
            type: true, status: true, year: true, totalEpisodes: true,
            genres: { select: { genre: { select: { name: true, slug: true } } } },
            episodes: { select: { id: true } },
          },
        },
        episode: true,
      },
      orderBy: { watchedAt: "desc" },
      take: 50,
    }),
    prisma.playbackProgress.findMany({
      where: { userId: session.user.id },
      include: {
        episode: {
          include: {
            content: {
              select: {
                id: true, slug: true, title: true, titleAlt: true, coverImage: true,
                type: true, status: true, year: true, totalEpisodes: true,
                genres: { select: { genre: { select: { name: true, slug: true } } } },
                episodes: { select: { id: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
  ]);

  const favoriteContents = favorites.map((f) => f.content);
  const historyContents = [...new Map(history.map((h) => [h.contentId, h.content])).values()];
  const continueContents = progress
    .filter((p) => p.progress > 0 && p.progress < p.duration * 0.95)
    .map((p) => p.episode.content);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>
      <LibraryTabs
        activeTab={tab}
        favoriteContents={favoriteContents}
        historyContents={historyContents}
        continueContents={continueContents}
      />
    </div>
  );
}
