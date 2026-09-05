import Link from "next/link";
import {
  RefreshCcw,
  ArrowLeft,
  PackageCheck,
  ShieldCheck,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  CreditCard,
  HelpCircle,
  MessageCircleHeart,
} from "lucide-react";

export const metadata = {
  title: "Política de Trocas e Devoluções | Moda Center Santa Cruz",
  description:
    "Regras claras para trocas, devoluções e arrependimento em até 30 dias (CDC e LGPD).",
};

const steps = [
  {
    icon: MessageCircleHeart,
    title: "1. Fale com a gente",
    desc: "Abra uma solicitação de troca pelo chat, WhatsApp (83) 99999-0000 ou e-mail informando o Nº do pedido. Responderemos rapidinho!",
    time: "Até 24h úteis",
  },
  {
    icon: Truck,
    title: "2. Envie o produto de volta",
    desc: "Você receberá uma etiqueta de postagem reversa gratuita por e-mail. Basta levar em qualquer agência dos Correios!",
    time: "Frete grátis",
  },
  {
    icon: PackageCheck,
    title: "3. Recebemos e analisamos",
    desc: "Nossa equipe analisa o produto em até 48h após a chegada. Tem que estar sem sinais de uso e com a etiqueta original!",
    time: "Até 48h",
  },
  {
    icon: RefreshCcw,
    title: "4. Escolha como quer resolver",
    desc: "Troca por outro tamanho/cor, crédito em sua conta para usar em qualquer compra ou reembolso integral no seu cartão.",
    time: "Você decide!",
  },
];

const regras = [
  {
    ok: true,
    title: "Trocas por tamanho ou modelo",
    desc: "Permitido em até 30 dias após o recebimento. Produto sem uso, etiqueta original e com nota fiscal.",
  },
  {
    ok: true,
    title: "Produto com defeito de fabricação",
    desc: "A partir da data da compra: 90 dias para duráveis, 30 dias para não duráveis (CDC Art. 18 e 26).",
  },
  {
    ok: true,
    title: "Direito de arrependimento",
    desc: "Compras online: 7 dias corridos após o recebimento, sem precisar justificar nada (CDC Art. 49).",
  },
  {
    ok: true,
    title: "Produto errado / diferente do pedido",
    desc: "Trocamos imediatamente por conta da loja (frete + produto novo enviado no mesmo dia útil).",
  },
  {
    ok: false,
    title: "Produto com sinais de uso ou lavagem",
    desc: "Infelizmente não podemos aceitar peças lavadas, usadas, sem etiqueta original ou com danos causados pelo cliente.",
  },
  {
    ok: false,
    title: "Produto personalizado / sob medida",
    desc: "Exceto em caso de defeito ou erro nosso — produtos customizados não são elegíveis para troca voluntária.",
  },
  {
    ok: false,
    title: "Acessórios (bijuterias, bolsas, cintos)",
    desc: "Trocam-se apenas com defeito de fabricação, mantidos lacrados em suas embalagens originais.",
  },
  {
    ok: false,
    title: "Promoções relâmpago / liquidação",
    desc: "Produtos de liquidação com aviso 'Produto sem troca' não aceitam troca voluntária — apenas com defeito.",
  },
];

export default function TrocasPage() {
  return (
    <div className="container-pad py-8 md:py-12 max-w-5xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      {/* Hero */}
      <header className="mb-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xl">
          <RefreshCcw className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Política de Trocas e Devoluções
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          Simples, justa e em conformidade com o Código de Defesa do
          Consumidor. Em até <b>30 dias</b> para trocar, <b>7 dias</b> para
          arrependimento.
        </p>

        <div className="mt-8 inline-flex flex-wrap items-center gap-3 justify-center">
          {[
            ["30 dias", "para troca voluntária"],
            ["7 dias", "direito arrependimento"],
            ["Frete grátis", "envio reversa"],
            ["48h", "análise de recebimento"],
          ].map(([a, b]) => (
            <div
              key={a}
              className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-sm"
            >
              <b className="text-primary">{a}</b>{" "}
              <span className="text-slate-600 dark:text-slate-400">— {b}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Passo a passo */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Como funciona a troca em 4 passos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="card p-5 relative group hover:-translate-y-1 transition-transform"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-primary/30" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center mb-4 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {s.desc}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5" />
                  {s.time}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Regras */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            O que pode e o que não pode
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regras.map((r) => (
            <div
              key={r.title}
              className={`card p-5 border-l-4 ${
                r.ok
                  ? "border-l-green-500"
                  : "border-l-red-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    r.ok
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  {r.ok ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold mb-1 ${
                      r.ok
                        ? "text-green-800 dark:text-green-300"
                        : "text-red-800 dark:text-red-300"
                    }`}
                  >
                    {r.ok ? "✅ " : "⛔ "}
                    {r.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formas de reembolso */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Como recebo meu dinheiro de volta?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Estorno no cartão",
              tempo: "Até 2 faturas",
              desc: "Reembolso integral estornado direto na fatura do seu cartão de crédito, sem burocracia.",
            },
            {
              title: "Crédito em conta",
              tempo: "Na hora 🚀",
              desc: "Valor fica como saldo disponível em sua conta para usar em qualquer compra, com 10% de bônus!",
            },
            {
              title: "PIX / Transferência",
              tempo: "Até 48h úteis",
              desc: "Depositamos direto na sua conta corrente ou poupança, com os dados que você nos fornecer.",
            },
          ].map((o) => (
            <div key={o.title} className="card p-6 relative overflow-hidden">
              <RotateCcw className="absolute -right-4 -bottom-4 w-20 h-20 text-slate-100 dark:text-slate-800 rotate-12" />
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 relative">
                {o.title}
              </h3>
              <p className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 relative">
                {o.tempo}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 relative">
                {o.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Resumo */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800 p-8 md:p-10 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> Perguntas rápidas
        </h2>

        <div className="space-y-3">
          {[
            [
              "Compre errado, o que faço?",
              "Solicite troca nos canais de atendimento dentro de 30 dias — frete de retorno é por nossa conta!",
            ],
            [
              "Posso trocar mais de uma vez?",
              "Primeira troca é gratuita. Demais trocas do mesmo pedido: sob consulta da equipe.",
            ],
            [
              "O prazo de 30 dias começa quando?",
              "A partir da data de entrega registrada pelo sistema de rastreio dos Correios/transportadora.",
            ],
            [
              "Produto de liquidação pode trocar?",
              "Apenas em caso de defeito de fabricação. Promos com aviso expresso são venda final.",
            ],
          ].map(([q, a], i) => (
            <details
              key={q}
              className="group bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 open:shadow-md transition"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-slate-800 dark:text-slate-200 pr-2 min-h-[40px]">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-primary font-bold">
                    Q{i + 1}.
                  </span>
                  {q}
                </span>
                <span className="text-primary text-xl transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-10 text-center">
        <Link
          href="/contato"
          className="btn btn-primary inline-flex min-h-[52px] px-8 text-base"
        >
          <MessageCircleHeart className="w-5 h-5" /> Solicitar troca agora
        </Link>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Dúvidas? WhatsApp (83) 99999-0000 • sac@modacentersc.com.br
        </p>
      </footer>
    </div>
  );
}
