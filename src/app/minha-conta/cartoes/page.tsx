'use client';

import * as React from 'react';
import Link from 'next/link';
import { CreditCard, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { maskCardNumber } from '@/lib/utils';
import { toast } from 'sonner';

const mockCards = [
  {
    id: '1',
    brand: 'Visa',
    last4: '1234',
    expiryMonth: 12,
    expiryYear: 28,
    isDefault: true,
  },
  {
    id: '2',
    brand: 'Mastercard',
    last4: '5678',
    expiryMonth: 8,
    expiryYear: 26,
    isDefault: false,
  },
];

export default function CartoesPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [cards, setCards] = React.useState<any[]>(mockCards);
  const [card, setCard] = React.useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    isDefault: false,
  });

  const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <CreditCard size={24} />
          Meus cartões
        </h2>
        {cards.length < 3 && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn-primary !py-2.5 !px-4 text-sm"
          >
            <Plus size={16} />
            Adicionar cartão
          </button>
        )}
      </div>

      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-800 flex items-start gap-2">
        <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
        <div>
          <strong>PCI DSS:</strong> seus dados estão protegidos. Apenas os 4 últimos dígitos dos cartões
          são armazenados para sua segurança. Usamos Stripe como gateway certificado PCI.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.length === 0 && (
          <div className="card p-10 text-center sm:col-span-2 lg:col-span-3 space-y-3">
            <CreditCard size={44} className="mx-auto text-gray-300" />
            <h3 className="font-bold text-gray-900">Nenhum cartão salvo</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Adicione cartões de crédito para finalizar compras mais rápido. Máximo 3 cartões.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex !py-2.5 !px-5 text-sm"
            >
              <Plus size={16} /> Cadastrar primeiro cartão
            </button>
          </div>
        )}
        {cards.map((c) => {
          const brandLower = c.brand?.toLowerCase() || 'visa';
          const colorMap: any = {
            visa: 'from-blue-700 via-blue-600 to-indigo-600',
            mastercard: 'from-orange-600 via-red-600 to-amber-500',
            elo: 'from-red-600 via-yellow-500 to-green-600',
            amex: 'from-indigo-700 via-blue-600 to-cyan-500',
            hipercard: 'from-red-800 via-red-700 to-red-600',
          };
          return (
            <div
              key={c.id}
              className={`relative p-5 sm:p-6 rounded-2xl text-white bg-gradient-to-br ${colorMap[brandLower] || colorMap.visa} shadow-lg overflow-hidden min-h-[200px] sm:min-h-[220px] flex flex-col justify-between`}
            >
              {c.isDefault && (
                <span className="absolute top-3 right-3 chip bg-white/20 backdrop-blur text-white !py-0.5 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Padrão
                </span>
              )}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-8 rounded bg-white/20 flex items-center justify-center text-xs font-black">
                    CHIP
                  </div>
                  <span className="text-base sm:text-lg font-black italic tracking-wide">
                    {c.brand || 'CARD'}
                  </span>
                </div>
                <p className="font-mono text-lg sm:text-2xl tracking-[0.2em] mb-4">
                  •••• •••• •••• {c.last4}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase opacity-75">Titular</p>
                  <p className="text-sm sm:text-base font-bold truncate">NOME CADASTRADO</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-[10px] uppercase opacity-75">Validade</p>
                  <p className="text-sm font-bold">
                    {String(c.expiryMonth).padStart(2, '0')}/{String(c.expiryYear).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/0 hover:to-black/5 transition pointer-events-none" />
            </div>
          );
        })}
      </div>

      {cards.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900">Gerenciar cartões</h3>
          <div className="card divide-y divide-gray-100 overflow-hidden">
            {cards.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 p-4 flex-wrap"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                    {c.brand?.slice(0, 4) || 'CARD'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      Final {c.last4}
                    </p>
                    <p className="text-xs text-gray-500">
                      Válido até {String(c.expiryMonth).padStart(2, '0')}/
                      {String(c.expiryYear).padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!c.isDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setCards(cards.map((x) => ({
                          ...x,
                          isDefault: x.id === c.id,
                        })));
                        toast.success('Cartão definido como padrão!');
                      }}
                      className="btn-outline-primary !py-2 !px-3 text-xs min-h-[40px]"
                    >
                      Definir padrão
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Remover este cartão?')) return;
                      setCards(cards.filter((x) => x.id !== c.id));
                      toast.success('Cartão removido!');
                    }}
                    className="btn-ghost !py-2 !px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 min-h-[40px]"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowForm(false)}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-extrabold text-gray-900 text-lg">Adicionar cartão</h3>
              <div className="space-y-3">
                <div>
                  <label className="label">Número do cartão</label>
                  <input
                    className="input"
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) =>
                      setCard({ ...card, number: maskCardNumber(e.target.value).slice(0, 19) })
                    }
                  />
                </div>
                <div>
                  <label className="label">Nome impresso</label>
                  <input
                    className="input"
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Validade (MM/AA)</label>
                    <input
                      className="input"
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(e) => {
                        const v = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 4)
                          .replace(/(\d{2})(\d)/, '$1/$2');
                        setCard({ ...card, expiry: v });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">CVV</label>
                    <input
                      className="input"
                      placeholder="123"
                      inputMode="numeric"
                      value={card.cvc}
                      onChange={(e) =>
                        setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })
                      }
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.isDefault}
                    onChange={(e) => setCard({ ...card, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-500"
                  />
                  <span className="text-sm text-gray-700">Definir como cartão padrão</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (card.number.length < 19 || card.name.length < 2 || card.expiry.length < 5 || card.cvc.length < 3) {
                      toast.error('Preencha todos os campos');
                      return;
                    }
                    const last4 = card.number.replace(/\s/g, '').slice(-4);
                    const brand = brands[Math.floor(Math.random() * brands.length)];
                    const [mm, yy] = card.expiry.split('/');
                    const newCard = {
                      id: String(Date.now()),
                      brand,
                      last4,
                      expiryMonth: parseInt(mm),
                      expiryYear: parseInt(yy),
                      isDefault: card.isDefault || cards.length === 0,
                    };
                    setCards([
                      ...cards.map((c) => (newCard.isDefault ? { ...c, isDefault: false } : c)),
                      newCard,
                    ]);
                    setCard({ number: '', name: '', expiry: '', cvc: '', isDefault: false });
                    toast.success('Cartão adicionado com sucesso!');
                    setShowForm(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Salvar cartão
                </button>
              </div>
              <p className="text-[11px] text-center text-gray-500 pt-1">
                🔒 Dados criptografados e enviados diretamente ao Stripe (PCI)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
