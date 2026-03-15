"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, Grid3X3, BookOpen, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  catalogue: <Grid3X3 className="h-4 w-4" />,
  library: <BookOpen className="h-4 w-4" />,
};

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

interface MobileMenuProps {
  links: NavLink[];
  locale: string;
  loginLabel: string;
  isLoggedIn: boolean;
}

export function MobileMenu({ links, locale, loginLabel, isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground md:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[300px] border-l border-white/5 bg-card shadow-2xl shadow-black/50 transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <span className="text-gradient text-lg font-bold">DonghuaStream</span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/5 hover:text-foreground"
              >
                {iconMap[link.icon] || null}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="space-y-3 border-t border-white/5 p-4">
            {!isLoggedIn && (
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                {loginLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
