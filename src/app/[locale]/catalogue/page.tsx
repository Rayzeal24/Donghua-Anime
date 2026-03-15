import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ContentGrid } from "@/components/content/content-grid";
import { ContentFilters } from "@/components/content/content-filters";
import { Grid3X3 } from "lucide-react";
import type { Prisma, ContentType, ContentStatus } from "@prisma/client";

const PAGE_SIZE = 24;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("catalogue");
  const locale = await getLocale();

  const genre = params.genre || "";
  const type = params.type || "";
  const status = params.status || "";
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const where: Prisma.ContentWhereInput = { visible: true };

  if (genre) {
    where.genres = { some: { genre: { slug: genre } } };
  }
  if (type) {
    where.type = type as ContentType;
  }
  if (status) {
    where.status = status as ContentStatus;
  }

  const orderBy: Prisma.ContentOrderByWithRelationInput =
    sort === "oldest"
      ? { createdAt: "asc" }
      : sort === "titleAsc"
        ? { title: "asc" }
        : sort === "titleDesc"
          ? { title: "desc" }
          : { createdAt: "desc" };

  const [contents, total, genres] = await Promise.all([
    prisma.content.findMany({
      where,
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
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.content.count({ where }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Grid3X3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground/60">
            {total} contenu{total > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ContentFilters genres={genres} />

      <ContentGrid contents={contents} emptyMessage={t("noContent")} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 pt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params2 = new URLSearchParams();
            if (genre) params2.set("genre", genre);
            if (type) params2.set("type", type);
            if (status) params2.set("status", status);
            if (sort !== "newest") params2.set("sort", sort);
            params2.set("page", p.toString());
            return (
              <a
                key={p}
                href={`/${locale}/catalogue?${params2.toString()}`}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  p === page
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-white/[0.03] text-muted-foreground ring-1 ring-white/[0.04] hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
