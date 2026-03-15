import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { episodeSchema } from "@/lib/validators";

const CONTENT_ROLES = ["ADMIN", "CONTENT_MANAGER"];

async function checkContentAccess() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user || !CONTENT_ROLES.includes(user.role)) return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkContentAccess())) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = episodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const episode = await prisma.episode.update({
      where: { id },
      data: {
        number: parsed.data.number,
        title: parsed.data.title ?? null,
        odyseeUrl: parsed.data.odyseeUrl,
        thumbnail: parsed.data.thumbnail ?? null,
        duration: parsed.data.duration ?? null,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json(episode);
  } catch (err) {
    console.error("[PATCH /api/admin/episodes/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkContentAccess())) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.episode.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
