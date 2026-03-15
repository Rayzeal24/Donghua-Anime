import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EpisodeList } from "@/components/content/episode-list";
import { FavoriteButton } from "./favorite-button";
import { auth } from "@/lib/auth";
import { Play, Calendar, Tv, Star } from "lucide-react";
import { ContentDetailImages, ContentDetailCover } from "./detail-images";

export const dynamic = "force-dynamic";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  noStore();
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("content");
  const session = await auth();

  const content = await prisma.content.findUnique({
    where: { slug, visible: true },
    include: {
      genres: { include: { genre: true } },
      episodes: { orderBy: { number: "asc" } },
      _count: { select: { favorites: true } },
    },
  });

  if (!content) notFound();

  const firstEpisode = content.episodes[0];

  let isFavorited = false;
  if (session?.user) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_contentId: {
          userId: session.user.id,
          contentId: content.id,
        },
      },
    });
    isFavorited = !!fav;
  }

  const statusLabel =
    content.status === "ONGOING"
      ? t("ongoing")
      : content.status === "COMPLETED"
        ? t("completed")
        : t("upcoming");

  return (
    <div className="pb-20">
      {/* Cinematic Banner */}
      <ContentDetailImages
        bannerImage={content.bannerImage}
        coverImage={content.coverImage}
        title={content.title}
      />

      <div className="mx-auto max-w-7xl px-4">
        <div className="animate-fade-in-up relative -mt-44 flex flex-col gap-8 sm:flex-row">
          {/* Cover */}
          <ContentDetailCover src={content.coverImage} alt={content.title} />

          {/* Info */}
          <div className="flex-1 space-y-5 pt-2 sm:pt-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {content.title}
              </h1>
              {content.titleAlt && (
                <p className="mt-2 text-lg text-muted-foreground/80">{content.titleAlt}</p>
              )}
            </div>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{statusLabel}</Badge>
              {content.year && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {content.year}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Tv className="h-3.5 w-3.5" />
                {content.type}
              </div>
              {content.episodes.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {content.episodes.length} {t("episodes")}
                </span>
              )}
              {content._count.favorites > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5" />
                  {content._count.favorites}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {content.genres.map((g) => (
                <Badge key={g.genre.id} variant="outline" className="border-white/10">
                  {g.genre.name}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-1">
              {firstEpisode && (
                <Link href={`/${locale}/watch/${firstEpisode.id}`}>
                  <Button size="lg" className="gap-2 glow shadow-xl shadow-primary/20">
                    <Play className="h-5 w-5" fill="currentColor" />
                    {t("watchNow")}
                  </Button>
                </Link>
              )}
              {session?.user && (
                <FavoriteButton
                  contentId={content.id}
                  isFavorited={isFavorited}
                />
              )}
            </div>

            {/* Description */}
            {content.description && (
              <div className="pt-3">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {t("description")}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground/90">
                  {content.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-16">
          <EpisodeList episodes={content.episodes} contentSlug={content.slug} />
        </div>
      </div>
    </div>
  );
}
