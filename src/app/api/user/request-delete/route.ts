import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user) return NextResponse.json({ error: 'unauth' }, { status: 401 });
    const body = await req.json();
    await prisma.user.update({
      where: { id: s.user.id },
      data: {
        dataRequestDelete: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: s.user.id,
        action: 'DELETE_REQUEST',
        entity: 'User',
        entityId: s.user.id,
        details: { reason: body.reason || null },
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro' }, { status: 500 });
  }
}
