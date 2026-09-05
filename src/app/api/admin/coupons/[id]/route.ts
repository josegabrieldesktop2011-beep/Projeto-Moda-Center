import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();

    const allowed = [
      "code",
      "discountType",
      "discountValue",
      "minOrderValue",
      "maxUses",
      "usesPerClient",
      "validFrom",
      "validUntil",
      "isActive",
    ];
    const data: any = {};
    for (const k of allowed) {
      if (body[k] !== undefined) data[k] = body[k];
    }
    if (data.code) data.code = data.code.toUpperCase();
    if (data.validFrom) data.validFrom = new Date(data.validFrom);
    if (data.validUntil) data.validUntil = new Date(data.validUntil);
    if (typeof data.discountValue === "string")
      data.discountValue = Number(data.discountValue);
    if (typeof data.minOrderValue === "string")
      data.minOrderValue = Number(data.minOrderValue);

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ coupon });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    await prisma.couponUsage.deleteMany({ where: { couponId: params.id } });
    await prisma.coupon.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
