import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations("profile");

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, avatar: true },
  });

  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-card/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
