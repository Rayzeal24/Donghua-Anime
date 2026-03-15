import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "../content-form";
import { EpisodeManager } from "./episode-manager";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("admin.contents");

  const [content, genres] = await Promise.all([
    prisma.content.findUnique({
      where: { id },
      include: {
        genres: { select: { genreId: true } },
        episodes: { orderBy: { number: "asc" } },
      },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!content) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t("edit")} - {content.title}</h1>
      <ContentForm genres={genres} content={content} />
      <hr className="border-border" />
      <EpisodeManager contentId={content.id} initialEpisodes={content.episodes} />
    </div>
  );
}
