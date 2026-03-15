"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

export function SearchBar({ className, compact = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router, locale]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("group relative", className)}>
      <Search
        className={cn(
          "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
          focused ? "text-primary" : "text-muted-foreground/50"
        )}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t("placeholder")}
        className={cn(
          "w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all duration-200 focus:border-primary/30 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary/15",
          compact ? "h-9" : "h-11"
        )}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}
