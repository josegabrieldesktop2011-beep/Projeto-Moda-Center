'use client';

import * as React from 'react';
import useSWR from 'swr';
import { MapPin, Plus, Edit3, Trash2, Star, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { maskCep } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : r.status === 401 ? [] : null));

export default function EnderecosPage() {
  const { data: addresses = [], mutate } = useSWR('/api/user/addresses', fetcher);
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const [form, setForm] = React.useState({
    recipient: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    isDefault: false,
  });

  const openForm = (addr?: any) => {
    if (addr) {
      setEditing(addr);
      setForm({
        recipient: addr.recipient,
        zipCode: addr.zipCode,
        street: addr.street,
        number: addr.number,
        complement: addr.complement || '',
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        isDefault: addr.isDefault,
      });
    } else {
      setEditing(null);
      setForm({
        recipient: '',
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isDefault: addresses.length === 0,
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const buscaCep = async () => {
    const clean = form.zipCode.replace(/\D/g, '');
    if (clean.length !== 8) return;
    const r = await fetch(`/api/cep/${clean}`);
    const d = await r.json();
    if (d && !d.error) {
      setForm({
        ...form,
        street: d.street || '',
        neighborhood: d.neighborhood || '',
        city: d.city || '',
        state: d.state || '',
      });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipient || !form.zipCode || !form.street || !form.number || !form.neighborhood || !form.city || !form.state) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    try {
      const res = await fetch('/api/user/addresses', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success(editing ? 'Endereço atualizado!' : 'Endereço criado!');
        mutate();
        closeForm();
      } else {
        toast.error(d.error || 'Erro');
      }
    } catch {}
  };

  const del = async (id: string) => {
    if (!confirm('Remover este endereço?')) return;
    const res = await fetch('/api/user/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success('Removido!');
      mutate();
    } else toast.error('Erro');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <MapPin size={24} />
          Meus endereços
        </h2>
        {addresses.length < 5 && (
          <button type="button" onClick={() => openForm()} className="btn-primary !py-2.5 !px-4 text-sm">
            <Plus size={16} />
            Novo endereço
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((a: any) => (
          <div key={a.id} className="card p-5 relative overflow-hidden hover:shadow-md transition">
            {a.isDefault && (
              <span className="absolute top-3 right-3 chip bg-primary-500 text-white !py-0.5 flex items-center gap-1">
                <Star size={10} fill="currentColor" /> Padrão
              </span>
            )}
            <p className="font-bold text-gray-900 mb-2">{a.recipient}</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {a.street}, {a.number}
              {a.complement && ` - ${a.complement}`}
              <br />
              {a.neighborhood} - {a.city}/{a.state}
              <br />
              CEP: {maskCep(a.zipCode)}
            </p>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => openForm(a)}
                className="btn-outline-primary !py-2 !px-3 text-xs flex-1 min-h-[40px]"
              >
                <Edit3 size={14} /> Editar
              </button>
              <button
                type="button"
                onClick={() => del(a.id)}
                className="btn-danger !py-2 !px-3 text-xs flex-1 min-h-[40px]"
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <div className="card p-10 text-center sm:col-span-2 space-y-3">
            <MapPin size={44} className="mx-auto text-gray-300" />
            <h3 className="font-bold text-gray-900">Nenhum endereço cadastrado</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Cadastre endereços para agilizar suas compras. Você pode cadastrar até 5 endereços.
            </p>
            <button
              type="button"
              onClick={() => openForm()}
              className="btn-primary inline-flex !py-2.5 !px-5 text-sm"
            >
              <Plus size={16} /> Cadastrar primeiro endereço
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={closeForm}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl p-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {editing ? 'Editar endereço' : 'Novo endereço'}
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center min-h-[44px] min-w-[44px]"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="label">Destinatário</label>
                  <input
                    className="input"
                    placeholder="Quem vai receber?"
                    value={form.recipient}
                    onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">CEP</label>
                  <input
                    className="input"
                    inputMode="numeric"
                    placeholder="00000-000"
                    value={form.zipCode}
                    onChange={(e) =>
                      setForm({ ...form, zipCode: maskCep(e.target.value) })
                    }
                    onBlur={buscaCep}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="label">Logradouro</label>
                    <input
                      className="input"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Número</label>
                    <input
                      className="input"
                      value={form.number}
                      onChange={(e) => setForm({ ...form, number: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Complemento</label>
                  <input
                    className="input"
                    placeholder="Apto, bloco, referencia..."
                    value={form.complement}
                    onChange={(e) => setForm({ ...form, complement: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="label">Bairro</label>
                    <input
                      className="input"
                      value={form.neighborhood}
                      onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label">Cidade</label>
                    <input
                      className="input"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label">UF</label>
                    <input
                      className="input"
                      maxLength={2}
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value.toUpperCase() })
                      }
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-500"
                  />
                  <span className="text-sm text-gray-700">Definir como endereço padrão</span>
                </label>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={closeForm} className="btn-secondary flex-1">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    <Check size={16} />
                    {editing ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
