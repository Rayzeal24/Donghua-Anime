"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { User, LogOut, BookOpen, Heart, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: { name?: string | null; email: string; role: string; avatar?: string | null };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigate = (path: string) => {
    router.push(`/${locale}${path}`);
    setOpen(false);
  };

  const initial = (user.name || user.email)[0]?.toUpperCase() || "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-accent/20 text-sm font-semibold text-primary ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40"
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>
      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-white/[0.06] bg-card p-1.5 shadow-2xl shadow-black/50">
          <div className="border-b border-white/[0.04] px-3.5 py-3">
            <p className="text-sm font-semibold">{user.name || user.email.split("@")[0]}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="mt-1 space-y-0.5">
            <MenuButton onClick={() => navigate("/library")} icon={<BookOpen className="h-4 w-4" />}>{t("library")}</MenuButton>
            <MenuButton onClick={() => navigate("/library?tab=favorites")} icon={<Heart className="h-4 w-4" />}>{t("favorites")}</MenuButton>
            <MenuButton onClick={() => navigate("/profile")} icon={<Settings className="h-4 w-4" />}>{t("profile")}</MenuButton>
            {["ADMIN", "MODERATOR", "CONTENT_MANAGER"].includes(user.role) && (
              <MenuButton onClick={() => navigate("/admin")} icon={<Shield className="h-4 w-4" />} accent>{t("admin")}</MenuButton>
            )}
          </div>
          <div className="mt-1 border-t border-white/[0.04] pt-1">
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/auth/login` })}
              className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-destructive transition-colors hover:bg-white/[0.04]"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuButton({ onClick, icon, children, accent }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-white/[0.04]",
        accent ? "text-primary" : "text-foreground"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
