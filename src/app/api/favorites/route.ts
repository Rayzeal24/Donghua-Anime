import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { contentId } = await req.json();
  if (!contentId) return NextResponse.json({ error: "contentId requis" }, { status: 400 });

  const fav = await prisma.favorite.create({
    data: { userId: session.user.id, contentId },
  });

  return NextResponse.json(fav, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { contentId } = await req.json();
  if (!contentId) return NextResponse.json({ error: "contentId requis" }, { status: 400 });

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, contentId },
  });

  return NextResponse.json({ success: true });
}
