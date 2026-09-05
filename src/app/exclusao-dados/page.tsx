"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserX,
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  FileWarning,
  User,
} from "lucide-react";
import { toast } from "sonner";

const motivos = [
  "Não quero mais usar a plataforma",
  "Dados incorretos / desatualizados",
  "Preferências de privacidade",
  "Direito ao esquecimento (LGPD art. 18)",
  "Duplicidade de cadastro",
  "Outro motivo",
];

export default function ExclusaoDadosPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    motivo: motivos[0],
    detalhes: "",
    confirmo: false,
  });
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.confirmo) {
      toast.error("É necessário confirmar a exclusão para prosseguir");
      return;
    }
    if (!form.nome || !form.email || !form.cpf) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setEnviando(true);
    try {
      await fetch("/api/user/request-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          cpf: form.cpf,
          telefone: form.telefone,
          motivo: form.motivo,
          detalhes: form.detalhes,
        }),
      });
      setStep(3);
      toast.success("Solicitação enviada com sucesso! ✅");
    } catch {
      toast.error("Erro ao enviar. Tente novamente ou contate nosso DPO.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container-pad py-8 md:py-12 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      <header className="mb-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-5 shadow-xl">
          <UserX className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Solicitar Exclusão de Dados
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Direito ao esquecimento — em conformidade com o Art. 18 da Lei Geral
          de Proteção de Dados (LGPD). Responderemos e executaremos sua
          solicitação em até{" "}
          <b className="text-slate-800 dark:text-slate-200">
            15 dias corridos
          </b>
          .
        </p>
      </header>

      {/* Etapas */}
      <div className="mb-8 grid grid-cols-3 gap-2 md:gap-4">
        {[
          { n: 1, label: "Seus Dados" },
          { n: 2, label: "Motivo e Confirmação" },
          { n: 3, label: "Solicitação Enviada" },
        ].map((s) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div key={s.n} className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-all ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 className="w-6 h-6" /> : s.n}
              </div>
              <span
                className={`text-xs md:text-sm font-semibold text-center ${
                  active || done
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.nome || !form.email || !form.cpf) {
              toast.error("Preencha nome, e-mail e CPF");
              return;
            }
            setStep(2);
          }}
          className="card p-6 md:p-8 space-y-5"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Passo 1 — Identificação
          </h2>
          <p className="text-sm text-slate-500">
            Informe seus dados para que possamos localizar todas as informações
            associadas à sua pessoa.
          </p>

          <div>
            <label className="label">Nome completo *</label>
            <input
              className="input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Ex: Maria da Silva"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">E-mail *</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="voce@email.com"
                required
              />
            </div>
            <div>
              <label className="label">CPF *</label>
              <input
                className="input font-mono"
                value={form.cpf}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setForm({
                    ...form,
                    cpf: v.replace(
                      /(\d{3})(\d{3})?(\d{3})?(\d{2})?/,
                      (a, b, c, d, e2) =>
                        `${b}${c ? "." + c : ""}${d ? "." + d : ""}${
                          e2 ? "-" + e2 : ""
                        }`
                    ),
                  });
                }}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">
              Telefone (opcional — para contato caso necessário)
            </label>
            <input
              className="input"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="flex justify-end pt-3">
            <button type="submit" className="btn btn-primary min-h-[48px]">
              Próximo passo →
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={enviar} className="card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-primary" /> Passo 2 —
              Motivo e Confirmação
            </h2>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-ghost !py-2 text-sm min-h-[40px]"
            >
              ← Voltar
            </button>
          </div>

          <div>
            <label className="label">Motivo da solicitação *</label>
            <select
              className="input"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              required
            >
              {motivos.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Detalhes adicionais (opcional)</label>
            <textarea
              rows={4}
              className="input"
              value={form.detalhes}
              onChange={(e) => setForm({ ...form, detalhes: e.target.value })}
              placeholder="Caso queira, descreva mais detalhes sobre sua solicitação..."
              maxLength={1000}
            />
            <p className="text-xs text-slate-500 mt-1 text-right">
              {form.detalhes.length}/1000 caracteres
            </p>
          </div>

          {/* Avisos LGPD */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> O que será excluído?
            </h3>
            <ul className="text-sm text-amber-900 dark:text-amber-200 space-y-1.5">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600" />
                Dados pessoais do cadastro (nome, CPF, telefone, endereços)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600" />
                Lista de desejos e preferências de notificação
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600" />
                Mensagens de atendimento (após 90 dias de auditoria)
              </li>
              <li className="flex gap-2">
                <FileWarning className="w-4 h-4 mt-0.5 text-red-600" />
                ⚠️ Pedidos e notas fiscais são mantidos por{" "}
                <b>5 anos por exigência legal</b> (Lei do IR e normas fiscais)
              </li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <input
              type="checkbox"
              checked={form.confirmo}
              onChange={(e) => setForm({ ...form, confirmo: e.target.checked })}
              className="w-5 h-5 accent-red-500 rounded mt-0.5 flex-shrink-0"
              required
            />
            <span className="text-sm text-red-800 dark:text-red-300">
              <b className="block mb-0.5">
                Declaro ter ciência de que:
              </b>
              1) A exclusão é irreversível para dados não legais; 2) Posso
              receber confirmação da solicitação por e-mail em até 48h; 3) A
              execução integral ocorrerá em até 15 dias corridos.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-ghost flex-1 min-h-[48px]"
            >
              ← Anterior
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="btn !bg-red-500 hover:!bg-red-600 !text-white flex-1 min-h-[48px]"
            >
              {enviando ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {enviando ? "Enviando..." : "Confirmar Solicitação de Exclusão"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="card p-8 md:p-12 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Solicitação enviada! 🎯
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Recebemos seu pedido de exclusão. Um e-mail de confirmação foi
              enviado para{" "}
              <b className="text-slate-800 dark:text-slate-200">
                {form.email || "seu endereço cadastrado"}
              </b>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Clock className="w-6 h-6 text-primary mb-2" />
              <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                Prazo máximo
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                15 dias corridos
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Shield className="w-6 h-6 text-primary mb-2" />
              <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                LGPD Art. 18
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                Direito ao esquecimento
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <Mail className="w-6 h-6 text-primary mb-2" />
              <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                DPO Contato
              </p>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                privacidade@modacentersc.com.br
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/"
              className="btn btn-outline flex-1 max-w-xs mx-auto sm:mx-0 min-h-[48px]"
            >
              Voltar para o início
            </Link>
            <a
              href="mailto:privacidade@modacentersc.com.br"
              className="btn btn-primary flex-1 max-w-xs mx-auto sm:mx-0 min-h-[48px]"
            >
              <Phone className="w-4 h-4" /> Falar com DPO
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
