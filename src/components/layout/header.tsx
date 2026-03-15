import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/ui/search-bar";

import { HeaderClient } from "./header-client";

export async function Header() {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations("nav");

  let dbUser: { name: string | null; email: string; avatar: string | null; role: string } | null = null;
  if (session?.user?.id) {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, avatar: true, role: true },
    });
    if (u) dbUser = u;
  }

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/catalogue`, label: t("catalogue") },
    ...(dbUser
      ? [{ href: `/${locale}/library`, label: t("library") }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.png" alt="DonghuaStream" className="h-9 w-9 rounded-lg" />
          <span className="text-gradient hidden text-lg font-bold tracking-tight sm:block">
            DonghuaStream
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <SearchBar compact className="hidden w-60 lg:block" />
          <HeaderClient
            user={
              dbUser
                ? {
                    name: dbUser.name,
                    email: dbUser.email,
                    role: dbUser.role,
                    avatar: dbUser.avatar,
                  }
                : null
            }
            locale={locale}
            loginLabel={t("login")}
          />
        </div>
      </div>
    </header>
  );
}
