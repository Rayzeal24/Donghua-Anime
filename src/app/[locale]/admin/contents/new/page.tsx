import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "../content-form";

export default async function NewContentPage() {
  const t = await getTranslations("admin.contents");
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("add")}</h1>
      <ContentForm genres={genres} />
    </div>
  );
}
