import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STAFF_ROLES = ["ADMIN", "MODERATOR", "CONTENT_MANAGER"];

async function getCallerRole(session: any): Promise<string | null> {
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role ?? null;
}

export async function PATCH(req: Request) {
  const session = await auth();
  const callerRole = await getCallerRole(session);

  if (!callerRole || !STAFF_ROLES.includes(callerRole)) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const { userId, action } = await req.json();

  if (!userId || !action) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  switch (action) {
    case "ban":
      if (callerRole !== "ADMIN" && callerRole !== "MODERATOR") {
        return NextResponse.json({ error: "Seuls les admins et modérateurs peuvent bannir" }, { status: 403 });
      }
      if (target.role === "ADMIN") {
        return NextResponse.json({ error: "Impossible de bannir un admin" }, { status: 403 });
      }
      await prisma.user.update({ where: { id: userId }, data: { banned: true } });
      break;

    case "unban":
      if (callerRole !== "ADMIN" && callerRole !== "MODERATOR") {
        return NextResponse.json({ error: "Seuls les admins et modérateurs peuvent débannir" }, { status: 403 });
      }
      await prisma.user.update({ where: { id: userId }, data: { banned: false } });
      break;

    case "makeModerator":
      if (callerRole !== "ADMIN") {
        return NextResponse.json({ error: "Seul un admin peut nommer un modérateur" }, { status: 403 });
      }
      await prisma.user.update({ where: { id: userId }, data: { role: "MODERATOR" } });
      break;

    case "makeContentManager":
      if (callerRole !== "ADMIN") {
        return NextResponse.json({ error: "Seul un admin peut nommer un gestionnaire" }, { status: 403 });
      }
      await prisma.user.update({ where: { id: userId }, data: { role: "CONTENT_MANAGER" } });
      break;

    case "removeRole":
      if (callerRole !== "ADMIN") {
        return NextResponse.json({ error: "Seul un admin peut retirer un rôle" }, { status: 403 });
      }
      if (target.role === "ADMIN") {
        return NextResponse.json({ error: "Impossible de retirer le rôle admin" }, { status: 403 });
      }
      await prisma.user.update({ where: { id: userId }, data: { role: "USER" } });
      break;

    case "delete":
      if (callerRole !== "ADMIN") {
        return NextResponse.json({ error: "Seul un admin peut supprimer un compte" }, { status: 403 });
      }
      if (target.role === "ADMIN") {
        return NextResponse.json({ error: "Impossible de supprimer un admin" }, { status: 403 });
      }
      await prisma.user.delete({ where: { id: userId } });
      break;

    default:
      return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
