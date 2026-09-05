"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircleHeart,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Waze,
  Instagram,
  Facebook,
  Youtube,
  ShoppingBag,
  FileQuestion,
} from "lucide-react";
import { toast } from "sonner";

const assuntos = [
  "Atendimento / Pedido",
  "Troca ou devolução",
  "Dúvida sobre produto",
  "Frete e entrega",
  "Cupom e promoção",
  "Cadastro / Senha",
  "Parcerias e atacado",
  "Outros",
];

export default function ContatoPage() {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: assuntos[0],
    numeroPedido: "",
    mensagem: "",
  });

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.assunto || !form.mensagem) {
      toast.error("Preencha nome, e-mail, assunto e mensagem");
      return;
    }
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEnviando(false);
    setEnviado(true);
    toast.success("Mensagem enviada com sucesso! 📨");
  };

  return (
    <div className="container-pad py-8 md:py-12 max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      {/* Hero */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-pink-500 p-8 md:p-12 text-white shadow-2xl mb-10 text-center relative">
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
            <MessageCircleHeart className="w-8 h-8 text-amber-200" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Fale com a gente 💜
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Estamos aqui para ajudar de verdade — atendimento humano, sem
            robôs, com resposta rápida em todos os canais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="https://wa.me/558137591001"
              target="_blank"
              rel="noreferrer"
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/25 transition border border-white/20 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold opacity-80 mb-0.5">
                  WhatsApp
                </p>
                <p className="font-extrabold text-lg">(81) 3759-1001</p>
                <p className="text-xs opacity-80">Resposta em minutos ⚡</p>
              </div>
            </a>
            <a
              href="mailto:contato@omodacenter.com.br"
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/25 transition border border-white/20 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold opacity-80 mb-0.5">
                  E-mail
                </p>
                <p className="font-extrabold text-sm md:text-lg break-all">
                  contato@omodacenter.com.br
                </p>
                <p className="text-xs opacity-80">Até 24h úteis</p>
              </div>
            </a>
            <a
              href="tel:08000800800"
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/25 transition border border-white/20 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold opacity-80 mb-0.5">
                  SAC 0800
                </p>
                <p className="font-extrabold text-lg">0800 080 0800</p>
                <p className="text-xs opacity-80">Seg a sáb, 8h às 18h</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2">
          {!enviado ? (
            <form onSubmit={enviar} className="card p-6 md:p-8 space-y-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> Envie uma mensagem
              </h2>
              <p className="text-sm text-slate-500">
                Nos conte como podemos ajudar — respondemos pessoalmente todas
                as mensagens!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Seu nome *</label>
                  <input
                    className="input"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Maria da Silva"
                  />
                </div>
                <div>
                  <label className="label">E-mail *</label>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="voce@email.com"
                  />
                </div>
                <div>
                  <label className="label">Telefone (com DDD)</label>
                  <input
                    className="input"
                    value={form.telefone}
                    onChange={(e) =>
                      setForm({ ...form, telefone: e.target.value })
                    }
                    placeholder="(83) 00000-0000"
                  />
                </div>
                <div>
                  <label className="label">Assunto *</label>
                  <select
                    className="input"
                    value={form.assunto}
                    onChange={(e) =>
                      setForm({ ...form, assunto: e.target.value })
                    }
                  >
                    {assuntos.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    Nº do pedido (se houver)
                  </label>
                  <input
                    className="input font-mono"
                    value={form.numeroPedido}
                    onChange={(e) =>
                      setForm({ ...form, numeroPedido: e.target.value })
                    }
                    placeholder="Ex: MC2024000001234"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Sua mensagem *</label>
                  <textarea
                    rows={6}
                    className="input resize-y min-h-[140px]"
                    value={form.mensagem}
                    onChange={(e) =>
                      setForm({ ...form, mensagem: e.target.value })
                    }
                    placeholder="Conte-nos em detalhes como podemos te ajudar hoje..."
                    maxLength={2000}
                  />
                  <p className="text-xs text-slate-500 mt-1 text-right">
                    {form.mensagem.length}/2000 caracteres
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={enviando}
                  className="btn btn-primary min-h-[48px] min-w-[200px]"
                >
                  {enviando ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {enviando ? "Enviando..." : "Enviar mensagem"}
                </button>
              </div>
            </form>
          ) : (
            <div className="card p-8 md:p-12 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Recebemos sua mensagem! 💜
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Obrigado por entrar em contato, <b>{form.nome}</b>! Nossa
                equipe retornará em breve pelo e-mail{" "}
                <b>{form.email}</b> ou WhatsApp.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <button
                  onClick={() => {
                    setEnviado(false);
                    setForm({
                      nome: "",
                      email: "",
                      telefone: "",
                      assunto: assuntos[0],
                      numeroPedido: "",
                      mensagem: "",
                    });
                  }}
                  className="btn btn-outline min-h-[48px]"
                >
                  Enviar outra mensagem
                </button>
                <Link href="/" className="btn btn-primary min-h-[48px]">
                  Voltar para a home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Loja Física */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Venha nos visitar!
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                Loja Matriz Moda Center
              </p>
              <p>Av. Prefeito José Severino Ferreira, s/n — Centro</p>
              <p>Santa Cruz do Capibaribe — PE</p>
              <p>CEP: 55190-000</p>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
              <div className="text-center text-slate-500 dark:text-slate-400 px-6">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Av. Pref. José Severino</p>
                <p className="text-xs">Santa Cruz do Capibaribe/PE</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost !py-2 text-xs min-h-[48px]"
              >
                <MapPin className="w-4 h-4" /> Google Maps
              </a>
              <a
                href="https://waze.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost !py-2 text-xs min-h-[48px]"
              >
                <Waze className="w-4 h-4" /> Waze
              </a>
            </div>
          </div>

          {/* Horário */}
          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Horário de
              atendimento
            </h3>
            <div className="space-y-2 text-sm">
              {[
                ["Segunda a Sexta", "08:00 — 18:00"],
                ["Sábados", "08:00 — 14:00"],
                ["Domingos e Feriados", "Fechado"],
                ["SAC Online", "24h via WhatsApp"],
              ].map(([d, h]) => (
                <div
                  key={d}
                  className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <span className="text-slate-600 dark:text-slate-400">
                    {d}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="card p-6 space-y-3">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-primary" /> Dúvidas
              frequentes
            </h3>
            <div className="space-y-1 text-sm">
              {[
                ["Como rastrear meu pedido?", "/minha-conta/pedidos"],
                ["Qual o prazo para troca?", "/trocas"],
                ["Como funciona o frete?", "/entregas"],
                ["Como usar cupom de desconto?", "/"],
              ].map(([q, l]) => (
                <Link
                  key={q}
                  href={l}
                  className="block py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-slate-700 dark:text-slate-300 font-medium flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <span className="text-primary group-hover:translate-x-1 transition">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Redes */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
              Siga nossas redes!
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                ["IG", Instagram, "bg-gradient-to-br from-pink-500 to-purple-600"],
                ["FB", Facebook, "bg-blue-600"],
                ["YT", Youtube, "bg-red-600"],
                ["TT", MessageSquare, "bg-slate-900 dark:bg-white dark:text-slate-900"],
              ].map(([l, Icon, bg]) => (
                <a
                  key={l as string}
                  href="#"
                  className={`aspect-square rounded-2xl text-white font-bold text-sm ${bg} flex flex-col items-center justify-center hover:scale-105 transition shadow-md`}
                >
                  {(Icon as any) && <Icon className="w-5 h-5 mb-1" />}
                  <span className="text-xs">{l}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
