"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Ticket,
  Percent,
  DollarSign,
  Calendar,
  Check,
  X,
  Users,
  Search,
  Loader2,
  AlertCircle,
  Tag,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import {
  formatCurrency,
  formatDate,
  maskString,
} from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usesPerClient: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usesCount: number;
  usages?: Array<{
    id: string;
    usedAt: string;
    order: { orderNumber: string; totalAmount: number } | null;
    user: { name: string; email: string } | null;
  }>;
}

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminCuponsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [viewUsages, setViewUsages] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 10,
    minOrderValue: 0,
    maxUses: 100,
    usesPerClient: 1,
    validFrom: new Date().toISOString().slice(0, 10),
    validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    isActive: true,
  });

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 0,
      maxUses: 100,
      usesPerClient: 1,
      validFrom: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000)
        .toISOString()
        .slice(0, 10),
      isActive: true,
    });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxUses: c.maxUses,
      usesPerClient: c.usesPerClient,
      validFrom: new Date(c.validFrom).toISOString().slice(0, 10),
      validUntil: new Date(c.validUntil).toISOString().slice(0, 10),
      isActive: c.isActive,
    });
    setShowModal(true);
  };

  const { data, mutate, isLoading } = useSWR("/api/admin/coupons", fetcher, {
    refreshInterval: 60000,
  });
  const coupons: Coupon[] = (data?.coupons || []).filter((c: Coupon) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error("Código do cupom é obrigatório");
      return;
    }
    if (form.discountValue <= 0) {
      toast.error("Valor do desconto deve ser maior que zero");
      return;
    }
    if (form.discountType === "PERCENTAGE" && form.discountValue > 100) {
      toast.error("Desconto percentual máximo é 100%");
      return;
    }
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/coupons/${editing.id}`
        : "/api/admin/coupons";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(
        `Cupom ${editing ? "atualizado" : "criado"} com sucesso! 🎟️`
      );
      setShowModal(false);
      resetForm();
      mutate();
    } catch {
      toast.error("Erro ao salvar cupom");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: Coupon) => {
    try {
      await fetch(`/api/admin/coupons/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      toast.success(`Cupom ${c.isActive ? "desativado" : "ativado"}!`);
      mutate();
    } catch {
      toast.error("Erro");
    }
  };

  const removeCoupon = async (c: Coupon) => {
    if (!confirm(`Excluir cupom ${c.code}?`)) return;
    try {
      await fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
      toast.success("Cupom excluído");
      mutate();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-7 h-7 text-primary" /> Cupons de Desconto
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie promoções, regras de uso e auditoria de cupons
          </p>
        </div>
        <button onClick={openCreate} className="btn btn-primary min-h-[48px]">
          <Plus className="w-5 h-5" /> Novo Cupom
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cupons",
            value: coupons.length,
            icon: Ticket,
            color: "text-primary",
          },
          {
            label: "Ativos",
            value: coupons.filter((c) => c.isActive).length,
            icon: Check,
            color: "text-green-500",
          },
          {
            label: "Usos Totais",
            value: coupons.reduce((a, c) => a + c.usesCount, 0),
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: "Expirados",
            value: coupons.filter(
              (c) => new Date(c.validUntil) < new Date()
            ).length,
            icon: Clock,
            color: "text-orange-500",
          },
        ].map((k) => (
          <div key={k.label} className="card p-5 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${k.color}`}
            >
              <k.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                {k.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Barra busca */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cupom por código..."
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="card p-12 text-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
          Carregando...
        </div>
      ) : coupons.length === 0 ? (
        <div className="card p-16 text-center">
          <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-1">Nenhum cupom cadastrado</h3>
          <p className="text-slate-500 text-sm mb-4">
            Crie seu primeiro cupom de desconto para impulsionar as vendas!
          </p>
          <button
            onClick={openCreate}
            className="btn btn-primary inline-flex"
          >
            <Plus className="w-4 h-4" /> Criar Cupom
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.map((c) => {
            const expired = new Date(c.validUntil) < new Date();
            const pct = c.maxUses > 0 ? (c.usesCount / c.maxUses) * 100 : 0;
            return (
              <div
                key={c.id}
                className={`card p-5 space-y-4 ${
                  !c.isActive || expired
                    ? "opacity-60 ring-1 ring-slate-200 dark:ring-slate-700"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-mono font-extrabold text-lg tracking-wider text-slate-900 dark:text-white break-all">
                        {c.code}
                      </span>
                    </div>
                    <span
                      className={`chip !py-1 ${
                        c.discountType === "PERCENTAGE"
                          ? "!bg-primary/10 !text-primary"
                          : "!bg-gold/10 !text-amber-700"
                      }`}
                    >
                      {c.discountType === "PERCENTAGE" ? (
                        <>
                          <Percent className="w-3.5 h-3.5" />
                          {c.discountValue}% OFF
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatCurrency(c.discountValue)}
                        </>
                      )}
                    </span>
                  </div>
                  {expired ? (
                    <span className="chip !py-1 !bg-red-100 !text-red-600 dark:!bg-red-900/30 dark:!text-red-400">
                      Expirado
                    </span>
                  ) : c.isActive ? (
                    <span className="chip !py-1 !bg-green-100 !text-green-700 dark:!bg-green-900/30 dark:!text-green-400">
                      <Check className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : (
                    <span className="chip !py-1 !bg-slate-200 !text-slate-600 dark:!bg-slate-700 dark:!text-slate-300">
                      Inativo
                    </span>
                  )}
                </div>

                <div className="text-sm space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> Pedido mínimo
                    </span>
                    <b className="text-slate-800 dark:text-slate-200">
                      {formatCurrency(c.minOrderValue)}
                    </b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Validade
                    </span>
                    <b className="text-slate-800 dark:text-slate-200 text-xs">
                      {formatDate(c.validFrom)} → {formatDate(c.validUntil)}
                    </b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Usos
                    </span>
                    <b className="text-slate-800 dark:text-slate-200">
                      {c.usesCount}/{c.maxUses}
                    </b>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progresso de uso</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 90
                            ? "bg-red-500"
                            : pct >= 70
                            ? "bg-amber-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => openEdit(c)}
                    className="btn btn-ghost !py-2 !px-3 flex-1 min-h-[40px]"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => setViewUsages(c)}
                    className="btn btn-ghost !py-2 !px-3 flex-1 min-h-[40px]"
                    title="Ver usos"
                  >
                    <Users className="w-4 h-4" /> {c.usesCount} usos
                  </button>
                  <button
                    onClick={() => toggleActive(c)}
                    className={`btn !py-2 !p-2 min-w-[40px] min-h-[40px] ${
                      c.isActive
                        ? "!bg-slate-200 dark:!bg-slate-700"
                        : "btn-primary"
                    }`}
                    title={c.isActive ? "Desativar" : "Ativar"}
                  >
                    {c.isActive ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeCoupon(c)}
                    className="btn !py-2 !p-2 !bg-red-500 hover:!bg-red-600 !text-white min-w-[40px] min-h-[40px]"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-6 h-6 text-primary" />
                {editing ? "Editar Cupom" : "Novo Cupom de Desconto"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="btn btn-ghost !p-2 min-w-[48px] min-h-[48px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Código do Cupom</label>
                  <input
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Ex: BEMVINDO10"
                    className="input font-mono uppercase tracking-widest"
                  />
                </div>
                <div>
                  <label className="label">Tipo de Desconto</label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountType: e.target.value as any,
                      })
                    }
                    className="input"
                  >
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    Valor do Desconto
                    {form.discountType === "PERCENTAGE" ? " (%)" : " (R$)"}
                  </label>
                  <input
                    type="number"
                    step={form.discountType === "PERCENTAGE" ? 1 : 0.01}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.minOrderValue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minOrderValue: Number(e.target.value),
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Limite de uso por cliente</label>
                  <input
                    type="number"
                    min={1}
                    value={form.usesPerClient}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        usesPerClient: Number(e.target.value),
                      })
                    }
                    className="input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">
                    Usos totais permitidos (0 = ilimitado)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxUses}
                    onChange={(e) =>
                      setForm({ ...form, maxUses: Number(e.target.value) })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Válido de</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Válido até</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded"
                />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Cupom ativo para uso imediato
                  </p>
                  <p className="text-xs text-slate-500">
                    Desmarque se quiser salvar como rascunho
                  </p>
                </div>
              </label>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="btn btn-ghost flex-1 min-h-[48px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary flex-1 min-h-[48px]"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {saving ? "Salvando..." : editing ? "Atualizar Cupom" : "Criar Cupom"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Auditoria Usos */}
      {viewUsages && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" /> Auditoria - Cupom{" "}
                  <span className="font-mono">{viewUsages.code}</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {viewUsages.usesCount} uso{viewUsages.usesCount !== 1 ? "s" : ""}{" "}
                  registrado
                  {viewUsages.usesCount !== 1 ? "s" : ""} • Retenção de 90 dias
                </p>
              </div>
              <button
                onClick={() => setViewUsages(null)}
                className="btn btn-ghost !p-2 min-w-[48px] min-h-[48px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              {!viewUsages.usages?.length ? (
                <div className="text-center py-12 text-slate-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p>Este cupom ainda não foi utilizado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {viewUsages.usages.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {u.user?.name || "Convidado"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {u.user?.email || "—"} • Pedido #
                          {u.order?.orderNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {u.order
                            ? formatCurrency(u.order.totalAmount)
                            : "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(u.usedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
