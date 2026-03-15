"use client";

import { SafeImage } from "@/components/ui/safe-image";

interface ContentDetailImagesProps {
  bannerImage: string | null;
  coverImage: string | null;
  title: string;
}

export function ContentDetailImages({
  bannerImage,
  coverImage,
  title,
}: ContentDetailImagesProps) {
  const bannerSrc = bannerImage || coverImage;

  return (
    <div className="relative h-80 overflow-hidden sm:h-[28rem]">
      <SafeImage
        src={bannerSrc}
        alt={title}
        fill
        className={!bannerImage && coverImage ? "blur-2xl scale-125" : ""}
        priority
      />
      {/* Multi-layer gradient for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-background/10" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-10 h-[300px] w-[500px] rounded-full bg-primary/[0.05] blur-[120px]" />
    </div>
  );
}

interface ContentDetailCoverProps {
  src: string | null;
  alt: string;
}

export function ContentDetailCover({ src, alt }: ContentDetailCoverProps) {
  return (
    <div className="relative h-72 w-48 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/[0.06] sm:h-80 sm:w-56">
      <SafeImage src={src} alt={alt} fill priority />
    </div>
  );
}
