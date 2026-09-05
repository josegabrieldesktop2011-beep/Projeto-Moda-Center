'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const requestSchema = z.object({ email: z.string().email('E-mail inválido') });

export default function ForgotPage() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (d: { email: string }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Erro ao enviar');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10">
        <div className="card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <Mail size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verifique seu e-mail</h2>
          <p className="text-gray-600 text-sm">
            Se sua conta existir, enviamos um link de redefinição.
            <br />
            <span className="text-xs text-gray-500">(modo dev: o link é exibido no console do servidor)</span>
          </p>
          <Link href="/auth/login" className="btn-primary w-full">
            Voltar para login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10">
      <div className="card p-8 max-w-md w-full space-y-5">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-extrabold text-gray-900">Recuperar senha</h1>
          <p className="text-sm text-gray-500">
            Digite seu e-mail que enviaremos as instruções
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">E-mail cadastrado</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                inputMode="email"
                placeholder="seu@email.com"
                {...register('email')}
                className="input pl-11"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
        <Link
          href="/auth/login"
          className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          ← Voltar ao login
        </Link>
      </div>
    </div>
  );
}
