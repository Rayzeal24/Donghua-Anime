import { redirect } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, Film, Users } from "lucide-react";

const STAFF_ROLES = ["ADMIN", "MODERATOR", "CONTENT_MANAGER"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations("admin");

  if (!session?.user?.id) {
    redirect(`/${locale}`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !STAFF_ROLES.includes(user.role)) {
    redirect(`/${locale}`);
  }

  const role = user.role;

  const navItems = [
    { href: `/${locale}/admin`, label: t("dashboard.title"), icon: LayoutDashboard, roles: STAFF_ROLES },
    { href: `/${locale}/admin/contents`, label: t("contents.title"), icon: Film, roles: ["ADMIN", "CONTENT_MANAGER"] },
    { href: `/${locale}/admin/users`, label: t("users.title"), icon: Users, roles: ["ADMIN", "MODERATOR"] },
  ].filter((item) => item.roles.includes(role));

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-56 flex-shrink-0 md:block">
        <nav className="sticky top-24 space-y-1">
          <h2 className="mb-4 text-lg font-bold text-primary">{t("title")}</h2>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
