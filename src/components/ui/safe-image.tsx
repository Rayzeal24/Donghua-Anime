"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/images/placeholder.svg";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  sizes?: string;
  wrapperClassName?: string;
}

export function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  style,
  priority,
  sizes,
  wrapperClassName,
}: SafeImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setErrored(false);
    setLoaded(false);
  }

  const effectiveSrc = src && !errored ? src : PLACEHOLDER;
  const isPlaceholder = effectiveSrc === PLACEHOLDER;

  const imgElement = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={effectiveSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (!errored) setErrored(true);
      }}
      className={cn(
        fill && "absolute inset-0 h-full w-full",
        "object-cover",
        !loaded && !isPlaceholder && "opacity-0",
        loaded && "opacity-100 transition-opacity duration-500",
        isPlaceholder && "opacity-50",
        className
      )}
      style={style}
      sizes={sizes}
    />
  );

  if (fill) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", wrapperClassName)}>
        {!loaded && !isPlaceholder && (
          <div className="shimmer absolute inset-0" />
        )}
        {imgElement}
      </div>
    );
  }

  return imgElement;
}
