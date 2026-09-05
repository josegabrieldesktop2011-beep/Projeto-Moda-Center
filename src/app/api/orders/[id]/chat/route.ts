import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }
    if (message.length > 1500) {
      return NextResponse.json(
        { error: "Mensagem muito longa (máx 1500 caracteres)" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { userId: true, id: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const isStaff = session.role === "ADMIN" || session.role === "VENDEDOR";
    const isOwner = order.userId && order.userId === session.userId;
    if (!isStaff && !isOwner) {
      return NextResponse.json({ error: "Acesso negado a este pedido" }, { status: 403 });
    }

    const sender = isStaff ? "STAFF" : "CLIENT";

    const chat = await prisma.orderChatMessage.create({
      data: {
        orderId: order.id,
        sender,
        message: message.trim(),
        userId: session.userId,
      },
    });

    return NextResponse.json({ message: chat });
  } catch (e: any) {
    console.error("[CHAT POST]", e);
    return NextResponse.json({ error: e.message || "Erro interno" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });
    if (!order) return NextResponse.json({ messages: [] });

    const isStaff = session.role === "ADMIN" || session.role === "VENDEDOR";
    const isOwner = order.userId === session.userId;
    if (!isStaff && !isOwner) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const messages = await prisma.orderChatMessage.findMany({
      where: { orderId: params.id },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    return NextResponse.json({ messages });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro" }, { status: 500 });
  }
}
