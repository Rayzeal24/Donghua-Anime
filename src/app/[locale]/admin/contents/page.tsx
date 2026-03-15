import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteContentButton } from "./delete-button";

export default async function AdminContentsPage() {
  const locale = await getLocale();
  const t = await getTranslations("admin.contents");

  const contents = await prisma.content.findMany({
    include: {
      _count: { select: { episodes: true, favorites: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href={`/${locale}/admin/contents/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("add")}
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Image</th>
              <th className="px-4 py-3 text-left font-medium">Titre</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-center font-medium">Ep.</th>
              <th className="px-4 py-3 text-center font-medium">Fav.</th>
              <th className="px-4 py-3 text-center font-medium">Visible</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contents.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  {c.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={c.coverImage} alt="" className="h-12 w-9 rounded object-cover" />
                  ) : (
                    <div className="flex h-12 w-9 items-center justify-center rounded bg-secondary text-[10px] text-muted-foreground">—</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    {c.titleAlt && (
                      <p className="text-xs text-muted-foreground">{c.titleAlt}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{c.type}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.status === "ONGOING" ? "success" : c.status === "COMPLETED" ? "default" : "warning"}>
                    {c.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">{c._count.episodes}</td>
                <td className="px-4 py-3 text-center">{c._count.favorites}</td>
                <td className="px-4 py-3 text-center">
                  {c.visible ? "✓" : "✗"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link href={`/${locale}/admin/contents/${c.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteContentButton contentId={c.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
