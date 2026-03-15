import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { episodeId, progress, duration } = await req.json();
  if (!episodeId) return NextResponse.json({ error: "episodeId requis" }, { status: 400 });

  const entry = await prisma.playbackProgress.upsert({
    where: {
      userId_episodeId: { userId: session.user.id, episodeId },
    },
    update: { progress: progress || 0, duration: duration || 0 },
    create: {
      userId: session.user.id,
      episodeId,
      progress: progress || 0,
      duration: duration || 0,
    },
  });

  return NextResponse.json(entry);
}
