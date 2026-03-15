import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contentSchema } from "@/lib/validators";

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
    const parsed = contentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { genreIds, ...rest } = parsed.data;

    await prisma.contentGenre.deleteMany({ where: { contentId: id } });

    const content = await prisma.content.update({
      where: { id },
      data: {
        title: rest.title,
        titleAlt: rest.titleAlt ?? null,
        slug: rest.slug,
        description: rest.description ?? null,
        coverImage: rest.coverImage ?? null,
        bannerImage: rest.bannerImage ?? null,
        type: rest.type,
        status: rest.status,
        year: rest.year ?? null,
        totalEpisodes: rest.totalEpisodes ?? null,
        featured: rest.featured,
        visible: rest.visible,
        genres: {
          create: genreIds.map((genreId) => ({ genreId })),
        },
      },
      include: { genres: { select: { genreId: true } } },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(content);
  } catch (err) {
    console.error("[PATCH /api/admin/contents/[id]]", err);
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
  await prisma.content.delete({ where: { id } });

  revalidatePath("/", "layout");

  return NextResponse.json({ success: true });
}
