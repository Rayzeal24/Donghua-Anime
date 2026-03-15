import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma, withRetry } from "@/lib/prisma";
import { ContentCarousel } from "@/components/content/content-carousel";
import { HeroSpotlight } from "@/components/content/hero-spotlight";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const contentSelect = {
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
};

const heroSelect = {
  ...contentSelect,
  description: true,
  bannerImage: true,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();
  const locale = await getLocale();
  const t = await getTranslations("home");

  const [featured, recent, donghua, anime] = await withRetry(() =>
    Promise.all([
      prisma.content.findMany({
        where: { visible: true, featured: true },
        select: heroSelect,
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.content.findMany({
        where: { visible: true },
        select: contentSelect,
        take: 14,
        orderBy: { createdAt: "desc" },
      }),
      prisma.content.findMany({
        where: { visible: true, type: "DONGHUA" },
        select: contentSelect,
        take: 14,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.content.findMany({
        where: { visible: true, type: "ANIME" },
        select: contentSelect,
        take: 14,
        orderBy: { updatedAt: "desc" },
      }),
    ])
  );

  const hasFeatured = featured.length > 0;

  return (
    <div className="pb-20">
      {/* Cinematic Hero */}
      {hasFeatured ? (
        <HeroSpotlight contents={featured} />
      ) : (
        <section className="relative overflow-hidden px-4 py-28 sm:py-36">
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-pulse-glow absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[150px]" />
            <div className="animate-pulse-glow absolute left-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-accent/[0.04] blur-[120px]" style={{ animationDelay: "2s" }} />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t("hero.streaming")}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{t("hero.title")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href={`/${locale}/catalogue`}>
                <Button size="lg" className="gap-2 glow shadow-xl shadow-primary/20">
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Content sections */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-8">
        {recent.length > 0 && (
          <ContentCarousel
            title={t("sections.recent")}
            contents={recent}
            viewAllHref={`/${locale}/catalogue?sort=newest`}
          />
        )}
        {donghua.length > 0 && (
          <ContentCarousel
            title={t("sections.donghua")}
            contents={donghua}
            viewAllHref={`/${locale}/catalogue?type=DONGHUA`}
          />
        )}
        {anime.length > 0 && (
          <ContentCarousel
            title={t("sections.anime")}
            contents={anime}
            viewAllHref={`/${locale}/catalogue?type=ANIME`}
          />
        )}
      </div>
    </div>
  );
}
