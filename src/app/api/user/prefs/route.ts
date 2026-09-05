import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({}, { status: 401 });
  const found = await prisma.notificationPrefs.findUnique({
    where: { userId: s.user.id },
  });
  if (found) return NextResponse.json(found);
  const created = await prisma.notificationPrefs.create({
    data: { userId: s.user.id },
  });
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({}, { status: 401 });
  const body = await req.json();
  const data: any = {};
  for (const k of [
    'emailStatus',
    'pushStatus',
    'emailPromos',
    'pushPromos',
    'pushWishlist',
  ]) {
    if (k in body) data[k] = !!body[k];
  }
  const upserted = await prisma.notificationPrefs.upsert({
    where: { userId: s.user.id },
    create: { userId: s.user.id, ...data },
    update: data,
  });
  return NextResponse.json(upserted);
}
