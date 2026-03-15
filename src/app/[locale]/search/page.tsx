import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ContentGrid } from "@/components/content/content-grid";
import { SearchBar } from "@/components/ui/search-bar";
import { Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const t = await getTranslations("search");

  const contents = q.trim()
    ? await prisma.content.findMany({
        where: {
          visible: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { titleAlt: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          slug: true,
          title: true,
          titleAlt: true,
          coverImage: true,
          type: true,
          status: true,
          year: true,
          totalEpisodes: true,
          genres: { select: { genre: { select: { name: true, slug: true } } } },
          episodes: { select: { id: true } },
        },
        take: 50,
        orderBy: { title: "asc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("placeholder")}</p>
        </div>
        <SearchBar className="w-full" />
      </div>

      <div className="mt-10">
        {q && contents.length > 0 && (
          <p className="mb-6 text-sm text-muted-foreground">
            {contents.length} {t("results")} &quot;{q}&quot;
          </p>
        )}

        {q && contents.length === 0 && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03]">
              <Search className="h-10 w-10 text-muted-foreground/20" />
            </div>
            <p className="text-lg text-muted-foreground">
              {t("noResults")} &quot;{q}&quot;
            </p>
          </div>
        )}

        {!q && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03]">
              <Search className="h-10 w-10 text-muted-foreground/20" />
            </div>
          </div>
        )}

        {contents.length > 0 && <ContentGrid contents={contents} />}
      </div>
    </div>
  );
}
