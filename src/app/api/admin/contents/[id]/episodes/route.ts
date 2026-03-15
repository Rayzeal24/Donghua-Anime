import { NextResponse } from "next/server";
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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkContentAccess())) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const { id: contentId } = await params;
  const body = await req.json();
  const parsed = episodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const episode = await prisma.episode.create({
    data: {
      ...parsed.data,
      thumbnail: parsed.data.thumbnail || null,
      contentId,
    },
  });

  return NextResponse.json(episode, { status: 201 });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: contentId } = await params;

  const episodes = await prisma.episode.findMany({
    where: { contentId },
    orderBy: { number: "asc" },
  });

  return NextResponse.json(episodes);
}
