import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const avatarFile = formData.get("avatar") as File | null;

    const data: Record<string, string> = {};

    if (name && name.trim().length >= 3) {
      const nameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!nameRegex.test(name)) {
        return NextResponse.json({ error: "Nom invalide : lettres, chiffres, tirets et underscores uniquement" }, { status: 400 });
      }

      const existing = await prisma.user.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          NOT: { id: session.user.id },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Ce nom d'utilisateur est déjà pris" }, { status: 409 });
      }

      data.name = name.trim();
    }

    if (avatarFile && avatarFile.size > 0) {
      const maxSize = 2 * 1024 * 1024;
      if (avatarFile.size > maxSize) {
        return NextResponse.json({ error: "Image trop lourde (2 Mo max)" }, { status: 400 });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json({ error: "Format d'image non supporté (JPG, PNG, WebP, GIF)" }, { status: 400 });
      }

      const ext = avatarFile.name.split(".").pop() || "png";
      const filename = `${session.user.id}-${Date.now()}.${ext}`;
      const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
      await mkdir(uploadDir, { recursive: true });
      const filepath = join(uploadDir, filename);

      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      await writeFile(filepath, buffer);

      data.avatar = `/uploads/avatars/${filename}`;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, avatar: true },
    });

    return NextResponse.json(user);
  }

  const { name } = await req.json();

  if (name && name.trim().length >= 3) {
    const existing = await prisma.user.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        NOT: { id: session.user.id },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Ce nom d'utilisateur est déjà pris" }, { status: 409 });
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
    },
    select: { id: true, name: true, avatar: true },
  });

  return NextResponse.json(user);
}
