'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone, FileCheck, Store } from 'lucide-react';
import { maskCpf, maskPhone, isValidEmail, isValidCpf } from '@/lib/utils';

const schema = z
  .object({
    name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    cpf: z.string().min(11, 'CPF inválido').refine((v) => isValidCpf(v), 'CPF inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
    role: z.enum(['CLIENTE', 'VENDEDOR']).default('CLIENTE'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme a senha'),
    terms: z.boolean().refine((v) => v, 'Você deve aceitar os termos'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      role: 'CLIENTE',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const role = watch('role');

  const onSubmit = async (d: Form) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes('e-mail') || data.error?.includes('E-mail')) {
          setError('email', { message: data.error });
        } else if (data.error?.includes('CPF')) {
          setError('cpf', { message: data.error });
        }
        toast.error(data.error || 'Erro ao cadastrar');
        return;
      }

      toast.success('Cadastro realizado! Efetuando login...');
      const login = await signIn('credentials', {
        redirect: false,
        email: d.email,
        password: d.password,
      });
      if (login?.ok) {
        router.push(d.role === 'VENDEDOR' ? '/admin' : '/');
      } else {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="card p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md mx-auto mb-2 bg-white flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo Moda Center Santa Cruz do Capibaribe"
                width={56}
                height={56}
                priority
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Criar sua conta</h1>
            <p className="text-sm text-gray-500">
              Cadastre-se na Moda Center Santa Cruz do Capibaribe para comprar e acompanhar seus pedidos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setValue('role', 'CLIENTE')}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition min-h-[48px] ${
                role === 'CLIENTE'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              Sou Cliente
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'VENDEDOR')}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition min-h-[48px] ${
                role === 'VENDEDOR'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store size={18} />
              Sou Vendedor
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Nome completo</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  {...register('name')}
                  className="input pl-11"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">E-mail</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    className="input pl-11"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Celular</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    {...register('phone')}
                    onChange={(e) => setValue('phone', maskPhone(e.target.value))}
                    className="input pl-11"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">CPF</label>
              <div className="relative">
                <FileCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000.000.000-00"
                  {...register('cpf')}
                  onChange={(e) => setValue('cpf', maskCpf(e.target.value))}
                  className="input pl-11"
                />
              </div>
              {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    {...register('password')}
                    className="input pl-11"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="label">Confirmar senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    {...register('confirmPassword')}
                    className="input pl-11"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none py-2">
              <input
                type="checkbox"
                {...register('terms')}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                Li e concordo com os{' '}
                <Link href="/termos" className="text-primary-600 font-semibold hover:underline">
                  Termos de Uso
                </Link>{' '}
                e com a{' '}
                <Link href="/privacidade" className="text-primary-600 font-semibold hover:underline">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base">
              {loading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Já tem conta?{' '}
            <Link href="/auth/login" className="font-bold text-primary-600 hover:text-primary-700">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
