'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean().default(true),
});

type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { status } = useSession();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const callback = search.get('callbackUrl') || '/';

  React.useEffect(() => {
    if (status === 'authenticated') router.replace(callback);
  }, [status, callback, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = async (d: Form) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: d.email,
        password: d.password,
      });
      if (result?.error) {
        setError('root', { message: result.error });
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success('Login realizado!');
        router.push(callback);
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: 'cliente' | 'vendedor' | 'admin') => {
    const map = {
      cliente: { email: 'cliente@modacenter.com.br', senha: 'Senha@123' },
      vendedor: { email: 'vendedor@modacenter.com.br', senha: 'Senha@123' },
      admin: { email: 'admin@modacenter.com.br', senha: 'Senha@123' },
    };
    const { email, senha } = map[role];
    await signIn('credentials', { redirect: false, email, password: senha });
    router.push(role === 'cliente' ? '/' : '/admin');
    toast.success(`Logado como ${role}!`);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
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
            <h1 className="text-2xl font-extrabold text-gray-900">Entrar na sua conta</h1>
            <p className="text-sm text-gray-500">Acesse sua conta Moda Center Santa Cruz do Capibaribe</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className="input pl-11"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label !mb-0">
                  Senha
                </label>
                <Link
                  href="/auth/esqueci-senha"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="input pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 w-9 h-9 flex items-center justify-center min-h-[44px] min-w-[44px]"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                {...register('remember')}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Manter conectado</span>
            </label>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base"
            >
              {loading ? 'Entrando...' : 'Entrar'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">Acesso rápido (contas demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('cliente')}
                className="btn-secondary !py-2 !px-3 text-xs min-h-[44px]"
              >
                Cliente
              </button>
              <button
                type="button"
                onClick={() => quickLogin('vendedor')}
                className="btn-secondary !py-2 !px-3 text-xs min-h-[44px]"
              >
                Vendedor
              </button>
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="btn-secondary !py-2 !px-3 text-xs min-h-[44px]"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Não tem conta?{' '}
            <Link href="/auth/cadastro" className="font-bold text-primary-600 hover:text-primary-700">
              Cadastre-se grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
