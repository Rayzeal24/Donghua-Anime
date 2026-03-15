"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  contentId: string;
  isFavorited: boolean;
}

export function FavoriteButton({ contentId, isFavorited: initial }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("content");

  const toggle = async () => {
    setLoading(true);
    try {
      const method = favorited ? "DELETE" : "POST";
      await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });
      setFavorited(!favorited);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={favorited ? "primary" : "outline"}
      onClick={toggle}
      loading={loading}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
      {favorited ? t("removeFavorites") : t("addFavorites")}
    </Button>
  );
}
