'use client';

import * as React from 'react';
import useSWR from 'swr';
import {
  Settings,
  Save,
  Shield,
  Bell,
  Trash2,
  Mail,
  Phone,
  FileCheck,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { maskCpf, maskPhone, maskCep } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

export default function ConfiguracoesPage() {
  const { data: profile, mutate } = useSWR('/api/user/profile', fetcher);
  const { data: prefs, mutate: mutatePrefs } = useSWR('/api/user/prefs', fetcher, {
    onErrorRetry: () => {},
  });
  const [saved, setSaved] = React.useState(false);
  const [form, setForm] = React.useState<any>({});
  const [pwd, setPwd] = React.useState({ current: '', new: '', confirm: '' });
  const [showPwd, setShowPwd] = React.useState<any>({});
  const [deleteReason, setDeleteReason] = React.useState('');

  React.useEffect(() => {
    if (profile && Object.keys(form).length === 0) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        cpf: profile.cpf || '',
        twoFactorEnabled: profile.twoFactorEnabled || false,
      });
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = { ...form };
    if (pwd.current && pwd.new) {
      if (pwd.new !== pwd.confirm) {
        toast.error('Senhas novas não conferem');
        return;
      }
      body.currentPassword = pwd.current;
      body.newPassword = pwd.new;
    }
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (res.ok) {
      toast.success('Dados atualizados!');
      mutate();
      setPwd({ current: '', new: '', confirm: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else toast.error(d.error || 'Erro');
  };

  const savePrefs = async (patch: any) => {
    const res = await fetch('/api/user/prefs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      mutatePrefs();
      toast.success('Preferências salvas');
    }
  };

  const requestDelete = async () => {
    if (!confirm('Tem certeza que deseja solicitar a exclusão da sua conta? Prazo de até 15 dias.')) return;
    const res = await fetch('/api/user/request-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: deleteReason }),
    });
    if (res.ok) toast.success('Solicitação enviada! Prazo de até 15 dias.');
    else toast.error('Erro');
  };

  const p = profile || {};
  const pr = prefs || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
        <Settings size={24} />
        Configurações da conta
      </h2>

      <form onSubmit={save} className="card p-5 sm:p-6 space-y-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <User size={18} />
          Dados pessoais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Nome completo</label>
            <input
              className="input"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input !pl-11 bg-gray-50" value={form.email || ''} disabled />
            </div>
            {p.emailVerified ? (
              <p className="mt-1 text-xs text-green-600 font-semibold flex items-center gap-1">
                ✓ E-mail verificado
              </p>
            ) : (
              <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                ⚠️ E-mail não verificado
              </p>
            )}
          </div>
          <div>
            <label className="label">Celular</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input !pl-11"
                inputMode="tel"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="label">CPF</label>
            <div className="relative">
              <FileCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input !pl-11"
                inputMode="numeric"
                value={form.cpf || ''}
                onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer min-h-[48px]">
              <input
                type="checkbox"
                checked={!!form.twoFactorEnabled}
                onChange={(e) =>
                  setForm({ ...form, twoFactorEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-primary-500"
              />
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Shield size={16} className="text-green-600" />
                Autenticação de dois fatores (2FA)
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <KeyRound size={18} />
            Alterar senha
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                key: 'current',
                label: 'Senha atual',
                placeholder: '••••••••',
              },
              {
                key: 'new',
                label: 'Nova senha',
                placeholder: 'Mínimo 6 caracteres',
              },
              {
                key: 'confirm',
                label: 'Confirmar nova senha',
                placeholder: 'Repita a nova senha',
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPwd[f.key] ? 'text' : 'password'}
                    className="input !pr-12"
                    placeholder={f.placeholder}
                    value={(pwd as any)[f.key]}
                    onChange={(e) => setPwd({ ...pwd, [f.key]: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd({ ...showPwd, [f.key]: !showPwd[f.key] })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8 flex items-center justify-center min-h-[40px] min-w-[40px]"
                    aria-label="Mostrar senha"
                  >
                    {showPwd[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" className="btn-primary !min-w-[180px]">
            <Save size={16} />
            {saved ? 'Salvo! ✓' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      <div className="card p-5 sm:p-6 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Bell size={18} />
          Preferências de notificação
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'emailStatus', label: 'E-mail: status de pedidos', def: true },
            { key: 'pushStatus', label: 'Push: status de pedidos', def: true },
            { key: 'emailPromos', label: 'E-mail: promoções e novidades', def: true },
            { key: 'pushPromos', label: 'Push: promoções relâmpago', def: true },
            { key: 'pushWishlist', label: 'Push: produtos da lista de desejos disponíveis', def: true },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 cursor-pointer transition min-h-[64px]"
            >
              <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              <input
                type="checkbox"
                checked={(pr as any)[item.key] ?? item.def}
                onChange={(e) => savePrefs({ [item.key]: e.target.checked })}
                className="w-5 h-5 rounded text-primary-500 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="card p-5 sm:p-6 border-red-200 border-2 bg-red-50/30 space-y-4">
        <h3 className="font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle size={18} />
          Excluir minha conta (LGPD)
        </h3>
        <p className="text-sm text-red-800/90 leading-relaxed">
          Solicite a exclusão completa dos seus dados pessoais de acordo com a LGPD (Lei Geral de
          Proteção de Dados). O prazo para atendimento é de até <strong>15 dias corridos</strong>.
        </p>
        <textarea
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          rows={3}
          placeholder="Motivo da exclusão (opcional)"
          maxLength={500}
          className="input !h-auto !bg-white"
        />
        <button
          type="button"
          onClick={requestDelete}
          className="btn-danger !py-2.5 !px-5"
        >
          <Trash2 size={16} />
          Solicitar exclusão de dados
        </button>
      </div>
    </div>
  );
}
