import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json([], { status: 401 });
  const addrs = await prisma.address.findMany({
    where: { userId: s.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
  return NextResponse.json(addrs);
}

export async function POST(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json([], { status: 401 });
  const body = await req.json();

  const count = await prisma.address.count({ where: { userId: s.user.id } });
  if (count >= 5) {
    return NextResponse.json({ error: 'Limite de 5 endereços atingido' }, { status: 400 });
  }

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: s.user.id },
      data: { isDefault: false },
    });
  }

  const addr = await prisma.address.create({
    data: {
      userId: s.user.id,
      recipient: body.recipient,
      street: body.street,
      number: body.number,
      complement: body.complement || null,
      neighborhood: body.neighborhood,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      isDefault: !!body.isDefault,
    },
  });
  return NextResponse.json(addr);
}

export async function PUT(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ error: 'unauth' }, { status: 401 });
  const { id, ...body } = await req.json();
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 });
  const exists = await prisma.address.findUnique({ where: { id } });
  if (!exists || exists.userId !== s.user.id) {
    return NextResponse.json({ error: 'não encontrado' }, { status: 404 });
  }
  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: s.user.id },
      data: { isDefault: false },
    });
  }
  const data: any = {};
  for (const k of ['recipient', 'street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode', 'isDefault']) {
    if (k in body) data[k] = body[k];
  }
  const updated = await prisma.address.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json({ error: 'unauth' }, { status: 401 });
  const { id } = await req.json();
  const exists = await prisma.address.findUnique({ where: { id } });
  if (!exists || exists.userId !== s.user.id) {
    return NextResponse.json({ error: 'não encontrado' }, { status: 404 });
  }
  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
