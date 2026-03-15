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

export async function POST(req: Request) {
  if (!(await checkContentAccess())) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = contentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { genreIds, ...data } = parsed.data;

  const content = await prisma.content.create({
    data: {
      ...data,
      coverImage: data.coverImage || null,
      bannerImage: data.bannerImage || null,
      genres: {
        create: genreIds.map((genreId) => ({ genreId })),
      },
    },
  });

  revalidatePath("/", "layout");

  return NextResponse.json(content, { status: 201 });
}
