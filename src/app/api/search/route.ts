import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const results = await prisma.content.findMany({
    where: {
      visible: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { titleAlt: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      titleAlt: true,
      coverImage: true,
      type: true,
      year: true,
    },
    take: 10,
    orderBy: { title: "asc" },
  });

  return NextResponse.json(results);
}
