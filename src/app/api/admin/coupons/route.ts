import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.role !== "ADMIN" && session.role !== "VENDEDOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        _count: { select: { usages: true } },
        usages: {
          take: 50,
          orderBy: { usedAt: "desc" },
          include: {
            order: { select: { orderNumber: true, totalAmount: true } },
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    const mapped = coupons.map((c: any) => ({
      ...c,
      usesCount: c._count.usages,
    }));
    delete mapped._count;

    return NextResponse.json({ coupons: mapped });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();
    const {
      code,
      discountType,
      discountValue,
      minOrderValue = 0,
      maxUses = 0,
      usesPerClient = 1,
      validFrom,
      validUntil,
      isActive = true,
    } = body;

    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const exists = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Código de cupom já existe" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        maxUses: Number(maxUses),
        usesPerClient: Number(usesPerClient),
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        isActive: Boolean(isActive),
        createdBy: session.userId ?? undefined,
      },
    });

    return NextResponse.json({ coupon });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
