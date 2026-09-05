import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@/lib/constants";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VENDEDOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();
    const { status, note, trackingCode } = body;

    if (!Object.values(OrderStatus).includes(status as any)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const o = await tx.order.update({
        where: { id: params.id },
        data: {
          status,
          trackingCode: trackingCode || order.trackingCode,
        },
      });

      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          status,
          note: note || null,
          actorId: session.user.id ?? undefined,
        },
      });

      return o;
    });

    return NextResponse.json({ order: updated });
  } catch (e: any) {
    console.error("[STATUS PATCH]", e);
    return NextResponse.json({ error: e.message || "Erro interno" }, { status: 500 });
  }
}
