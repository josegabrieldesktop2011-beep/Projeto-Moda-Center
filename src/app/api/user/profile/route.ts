import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, isValidCpf } from '@/lib/utils';

export async function GET() {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user) return NextResponse.json({ error: 'unauth' }, { status: 401 });
    const u = await prisma.user.findUnique({
      where: { id: s.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        cpf: true,
        avatarUrl: true,
        twoFactorEnabled: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    if (!u) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(u);
  } catch (e) {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user) return NextResponse.json({ error: 'unauth' }, { status: 401 });

    const b = await req.json();
    const data: any = {};
    if (b.name) data.name = b.name.trim();
    if (b.phone) data.phone = b.phone;
    if (b.cpf) {
      if (!isValidCpf(b.cpf)) return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
      data.cpf = b.cpf;
    }
    if (b.twoFactorEnabled !== undefined) data.twoFactorEnabled = !!b.twoFactorEnabled;

    if (b.currentPassword && b.newPassword) {
      const user = await prisma.user.findUnique({ where: { id: s.user.id } });
      if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const ok = await require('bcryptjs').compare(b.currentPassword, user.passwordHash);
      if (!ok) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
      if (b.newPassword.length < 6) {
        return NextResponse.json({ error: 'Nova senha muito curta' }, { status: 400 });
      }
      data.passwordHash = await hashPassword(b.newPassword);
    }

    await prisma.user.update({ where: { id: s.user.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'error' }, { status: 500 });
  }
}
