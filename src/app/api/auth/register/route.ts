import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, isValidEmail, isValidCpf } from '@/lib/utils';
import { z } from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha inválida'),
    role: z.enum(['CLIENTE', 'VENDEDOR']).default('CLIENTE'),
    cpf: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role, cpf, phone } = parsed.data;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    if (cpf && !isValidCpf(cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado.' },
        { status: 409 }
      );
    }

    if (cpf) {
      const existingCpf = await prisma.user.findUnique({ where: { cpf } });
      if (existingCpf) {
        return NextResponse.json(
          { error: 'Este CPF já está cadastrado.' },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: await hashPassword(password),
        role,
        cpf: cpf || null,
        phone: phone || null,
        notificationPrefs: { create: {} },
      },
      select: { id: true, name: true, email: true, role: true },
    });

    await prisma.auditLog.create({
      data: { action: 'REGISTER', entity: 'User', entityId: user.id },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { error: 'Erro interno ao cadastrar. Tente novamente.' },
      { status: 500 }
    );
  }
}
