import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/utils';
import { randomBytes } from 'crypto';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Informe o e-mail' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    await new Promise((r) => setTimeout(r, 600));

    if (user) {
      const token = randomBytes(32).toString('hex');
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 3600 * 1000),
        },
      });
      console.log(`[MOCK EMAIL] Link de recuperação para ${user.email}: /auth/reset?token=${token}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Se o e-mail existir, enviamos as instruções.',
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

const resetSchema = z
  .object({
    token: z.string().min(8),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: parsed.data.token,
        resetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado.' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(parsed.data.password),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso.' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
