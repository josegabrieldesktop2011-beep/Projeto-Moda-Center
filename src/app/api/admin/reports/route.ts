import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.role !== "ADMIN" && session.role !== "VENDEDOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");

    let dateFrom: Date;
    let dateTo: Date;
    if (dateFromParam && dateToParam) {
      dateFrom = new Date(dateFromParam);
      dateTo = new Date(dateToParam + "T23:59:59");
    } else {
      const days = Number(period) || 30;
      dateTo = new Date();
      dateFrom = new Date(Date.now() - days * 24 * 3600 * 1000);
    }
    dateFrom.setHours(0, 0, 0, 0);

    const paidOrDelivered = {
      createdAt: { gte: dateFrom, lte: dateTo },
      status: { in: ["PAGO", "PROCESSANDO", "ENVIADO", "ENTREGUE"] },
    };

    const [
      totalRevenueQ,
      ordersCount,
      canceledOrders,
      newClients,
      topProductsQ,
      salesByCategoryQ,
      ordersExport,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: paidOrDelivered as any,
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.order.count({
        where: { createdAt: { gte: dateFrom, lte: dateTo } },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: dateFrom, lte: dateTo },
          status: "CANCELADO",
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: dateFrom, lte: dateTo },
          role: "CLIENTE",
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productName"],
        where: {
          order: paidOrDelivered as any,
        },
        _sum: { quantity: true, priceAtPurchase: true },
        orderBy: { _sum: { quantity: "desc" } as any,
        take: 30,
      }),
      prisma.product.findMany({
        where: {
          orderItems: {
            some: { order: paidOrDelivered as any },
          },
        },
        include: {
          category: true,
          orderItems: {
            where: { order: paidOrDelivered as any },
            select: { quantity: true, priceAtPurchase: true },
          },
        },
        take: 50,
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: dateFrom, lte: dateTo } },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
        take: 1000,
      }),
    ]);

    const totalRevenue = totalRevenueQ._sum.totalAmount || 0;
    const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;

    const productsSold = (topProductsQ as any[]).reduce(
      (a, b) => a + (b._sum?.quantity || 0),
      0
    );
    const topProducts = (topProductsQ as any[]).map((p) => ({
      id: p.productName,
      productName: p.productName,
      totalQty: p._sum?.quantity || 0,
      totalRevenue: (p._sum?.priceAtPurchase
        ? p._sum.quantity * p._sum.priceAtPurchase
        : 0,
    }));

    const catMap = new Map<string, number>();
    for (const p of salesByCategoryQ as any[]) {
      const cat = p.category?.name || "Sem Categoria";
      let rev = 0;
      for (const it of p.orderItems) rev += it.quantity * it.priceAtPurchase;
      catMap.set(cat, (catMap.get(cat) || 0) + rev);
    }
    const salesByCategory = Array.from(catMap.entries()).map(
      ([name, value) => ({ name, value })
    );

    // salesByDay
    const days = Math.min(90, Math.ceil((+dateTo - +dateFrom) / 86400000));
    const salesByDay: any[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(+dateFrom + i * 86400000);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      salesByDay.push({
        date: d.toISOString().slice(0, 10),
        revenue: 0,
        orders: 0,
      });
    }
    const dayOrders = await prisma.order.findMany({
      where: paidOrDelivered as any,
      select: { createdAt: true, totalAmount: true },
    });
    for (const o of dayOrders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      const it = salesByDay.find((s) => s.date === key);
      if (it) {
        it.revenue += o.totalAmount;
        it.orders += 1;
      }
    }

    return NextResponse.json({
      summary: {
        totalRevenue,
        ordersCount,
        avgOrderValue,
        newClients,
        productsSold,
        canceledOrders,
      },
      topProducts,
      salesByCategory,
      salesByDay,
      ordersExport,
    });
  } catch (e: any) {
    console.error("[REPORTS]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
