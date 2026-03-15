"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { SafeImage } from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroContent {
  id: string;
  slug: string;
  title: string;
  titleAlt: string | null;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  type: string;
  status: string;
  year: number | null;
  genres: { genre: { name: string; slug: string } }[];
  episodes: { id: string }[];
}

interface HeroSpotlightProps {
  contents: HeroContent[];
}

const ROTATION_MS = 2500;

export function HeroSpotlight({ contents }: HeroSpotlightProps) {
  const locale = useLocale();
  const t = useTranslations("home");
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % contents.length) + contents.length) % contents.length);
      setProgressKey((k) => k + 1);
    },
    [contents.length]
  );

  useEffect(() => {
    if (contents.length <= 1) return;
    const interval = setInterval(() => {
      goTo(current + 1);
    }, ROTATION_MS);
    return () => clearInterval(interval);
  }, [contents.length, current, goTo]);

  if (contents.length === 0) return null;

  const item = contents[current];
  const firstEpisodeId = item.episodes[0]?.id;

  return (
    <section className="relative flex min-h-[50vh] items-end overflow-hidden sm:min-h-[60vh] lg:min-h-[70vh]">
      {/* Background images - crossfade */}
      {contents.map((c, i) => {
        const src = c.bannerImage || c.coverImage;
        return (
          <div
            key={c.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              i === current ? "opacity-100" : "opacity-0"
            )}
          >
            {src ? (
              <SafeImage src={src} alt={c.title} fill priority={i === 0} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
            )}
          </div>
        );
      })}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-background/10" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[600px] rounded-full bg-primary/[0.06] blur-[150px]" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-40">
        <div className="max-w-2xl space-y-5" key={`hero-${current}`} style={{ animation: "fadeInUp 0.4s ease-out both" }}>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border border-primary/20 bg-primary/20 text-primary backdrop-blur-sm">
              {item.type}
            </Badge>
            {item.year && (
              <Badge variant="secondary" className="border border-white/10 bg-white/10 text-white/90 backdrop-blur-sm">
                {item.year}
              </Badge>
            )}
            {item.genres.slice(0, 3).map((g) => (
              <Badge
                key={g.genre.slug}
                variant="outline"
                className="hidden border-white/10 text-white/70 backdrop-blur-sm sm:inline-flex"
              >
                {g.genre.name}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-2xl sm:text-5xl lg:text-6xl">
            {item.title}
          </h1>
          {item.titleAlt && (
            <p className="text-lg text-white/50">{item.titleAlt}</p>
          )}

          {/* Description */}
          {item.description && (
            <p className="line-clamp-3 max-w-xl text-base leading-relaxed text-white/60">
              {item.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {firstEpisodeId && (
              <Link href={`/${locale}/watch/${firstEpisodeId}`}>
                <Button size="lg" className="gap-2 glow shadow-xl shadow-primary/20">
                  <Play className="h-5 w-5" fill="currentColor" />
                  {t("hero.cta")}
                </Button>
              </Link>
            )}
            <Link href={`/${locale}/content/${item.slug}`}>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10"
              >
                <Info className="h-5 w-5" />
                {t("hero.details")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        {contents.length > 1 && (
          <div className="absolute bottom-8 right-4 flex items-center gap-3 sm:right-8">
            <button
              onClick={() => goTo(current - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {contents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ease-out",
                    i === current ? "w-8" : "w-2"
                  )}
                >
                  <div className="absolute inset-0 rounded-full bg-white/20" />
                  {i === current && (
                    <div
                      key={progressKey}
                      className="absolute inset-0 rounded-full bg-primary"
                      style={{
                        transformOrigin: "left",
                        animation: `progressBar ${ROTATION_MS}ms linear both`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo(current + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
