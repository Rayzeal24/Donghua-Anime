import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Film, Users, Tv, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const t = await getTranslations("admin.dashboard");

  const [totalContents, totalUsers, totalEpisodes, totalViews] = await Promise.all([
    prisma.content.count(),
    prisma.user.count(),
    prisma.episode.count(),
    prisma.watchHistory.count(),
  ]);

  const stats = [
    { label: t("totalContents"), value: totalContents, icon: Film },
    { label: t("totalUsers"), value: totalUsers, icon: Users },
    { label: t("totalEpisodes"), value: totalEpisodes, icon: Tv },
    { label: t("totalViews"), value: totalViews, icon: Eye },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2.5">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
