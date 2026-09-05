import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.role !== "ADMIN" && session.role !== "VENDEDOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const clients = await prisma.user.findMany({
      where: { role: "CLIENTE" },
      orderBy: [{ createdAt: "desc" }],
      include: {
        _count: {
          select: { orders: true, reviews: true, addresses: true },
        },
        orders: {
          select: { totalAmount: true, status: true },
        },
      },
    });

    return NextResponse.json({ clients });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
