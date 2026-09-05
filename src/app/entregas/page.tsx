import Link from "next/link";
import {
  Truck,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Gift,
  Package,
  Store,
  Search,
  ShieldCheck,
  AlertTriangle,
  Banknote,
  HelpCircle,
  MessageCircleHeart,
  Sparkles,
  Zap,
  Rocket,
} from "lucide-react";

export const metadata = {
  title: "Prazos de Entrega e Frete | Moda Center Santa Cruz",
  description:
    "Tudo sobre envio, frete grátis, cálculo de prazo e modalidades de entrega das compras Moda Center SC.",
};

const modalidades = [
  {
    icon: Rocket,
    nome: "SEDEX / Expressa",
    destaque: "Mais rápido 🚀",
    prazos: [
      { reg: "Nordeste", prazo: "1 - 2 dias úteis" },
      { reg: "Sudeste", prazo: "2 - 3 dias úteis" },
      { reg: "Sul / Centro-Oeste", prazo: "3 - 5 dias úteis" },
      { reg: "Norte", prazo: "5 - 8 dias úteis" },
    ],
    valor: "A partir de R$ 12,90",
    cor: "from-red-500 to-orange-500",
    textoCor: "text-red-500",
  },
  {
    icon: Truck,
    nome: "PAC / Econômica",
    destaque: "Mais barato 💰",
    prazos: [
      { reg: "Nordeste", prazo: "3 - 5 dias úteis" },
      { reg: "Sudeste", prazo: "5 - 8 dias úteis" },
      { reg: "Sul / Centro-Oeste", prazo: "7 - 12 dias úteis" },
      { reg: "Norte", prazo: "10 - 18 dias úteis" },
    ],
    valor: "A partir de R$ 7,90",
    cor: "from-blue-500 to-cyan-500",
    textoCor: "text-blue-500",
  },
  {
    icon: Store,
    nome: "Retirada na Loja",
    destaque: "Grátis 🎉",
    prazos: [
      { reg: "Imediato", prazo: "Disponível em até 2 horas após aprovação" },
      { reg: "Localização", prazo: "Santa Cruz do Capibaribe/PE" },
      { reg: "Endereço", prazo: "Av. Santa Cruz, 1000 - Centro" },
      { reg: "Horário", prazo: "Seg a sáb: 8h às 18h" },
    ],
    valor: "R$ 0,00 — Sem frete!",
    cor: "from-emerald-500 to-green-500",
    textoCor: "text-emerald-500",
  },
];

const regioes = [
  {
    flag: "🌴",
    nome: "Nordeste",
    frete: "A partir de R$ 7,90",
    gratis: "Em compras acima de R$ 149",
    cidades: "Recife, Salvador, Fortaleza, Natal, João Pessoa, Teresina, Maceió, Aracaju, Campina Grande...",
  },
  {
    flag: "🏙️",
    nome: "Sudeste",
    frete: "A partir de R$ 9,90",
    gratis: "Em compras acima de R$ 199",
    cidades: "São Paulo, Rio de Janeiro, Belo Horizonte, Vitória, Campinas, Santos, Uberlândia...",
  },
  {
    flag: "🌻",
    nome: "Sul",
    frete: "A partir de R$ 14,90",
    gratis: "Em compras acima de R$ 249",
    cidades: "Porto Alegre, Curitiba, Florianópolis, Londrina, Caxias do Sul, Joinville...",
  },
  {
    flag: "🌾",
    nome: "Centro-Oeste",
    frete: "A partir de R$ 12,90",
    gratis: "Em compras acima de R$ 229",
    cidades: "Brasília, Goiânia, Cuiabá, Campo Grande, Anápolis, Uberaba...",
  },
  {
    flag: "🌳",
    nome: "Norte",
    frete: "A partir de R$ 16,90",
    gratis: "Em compras acima de R$ 299",
    cidades: "Manaus, Belém, Porto Velho, Palmas, Boa Vista, Rio Branco, Macapá...",
  },
];

export default function EntregasPage() {
  return (
    <div className="container-pad py-8 md:py-12 max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      {/* Hero */}
      <header className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-cyan-600 p-8 md:p-14 text-white shadow-2xl mb-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase mb-5">
            <Sparkles className="w-4 h-4 text-amber-200" /> Entregas para todo
            o Brasil
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight max-w-3xl">
            Frete grátis a partir de{" "}
            <span className="text-amber-300 underline decoration-white/30">
              R$ 199*
            </span>{" "}
            no Sudeste!
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            Confira prazos, valores e tudo sobre como a Moda Center Santa Cruz
            entrega seu pedido com segurança.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { icon: Truck, n: "2500+", l: "Cidades atendidas" },
              { icon: Zap, n: "24h", l: "Postagem após aprovação" },
              { icon: ShieldCheck, n: "100%", l: "Seguro contra extravio" },
              { icon: Gift, n: "26+1", l: "Estados + DF" },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.l}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <Icon className="w-6 h-6 mb-2 text-amber-300" />
                  <p className="text-2xl md:text-3xl font-extrabold">{k.n}</p>
                  <p className="text-xs md:text-sm text-white/80 mt-1">
                    {k.l}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs md:text-sm text-white/70 max-w-xl">
            *Regras de frete grátis: confira os valores mínimos por região
            abaixo. Válido para PAC e para todo o território nacional.
          </p>
        </div>
      </header>

      {/* Calcular frete */}
      <section className="card p-6 md:p-8 mb-12 -mt-4 relative z-10 mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-2 mb-2 font-bold text-slate-800 dark:text-slate-200">
              <Search className="w-5 h-5 text-primary" /> Calcular prazo e
              frete agora
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Digite seu CEP (ex: 55000-000)"
                maxLength={9}
                className="input flex-1 font-mono text-lg"
              />
              <Link
                href="/carrinho"
                className="btn btn-primary min-h-[48px] min-w-[180px] justify-center"
              >
                <Package className="w-5 h-5" />
                Ir para o carrinho
              </Link>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              O cálculo exato do frete e prazo são feitos direto no carrinho de
              compras via API dos Correios.
            </p>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Modalidades de envio
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Escolha a opção que melhor combina com a sua necessidade — todas
            contam com seguro e rastreio em tempo real!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {modalidades.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.nome}
                className="card p-6 hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.cor} text-white flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    {m.nome}
                  </h3>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 ${m.textoCor}`}
                  >
                    {m.destaque}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {m.prazos.map((p) => (
                    <div
                      key={p.reg}
                      className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <span className="text-slate-500 dark:text-slate-400">
                        {p.reg}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.prazo}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                    Valor estimado
                  </p>
                  <p className="font-extrabold text-2xl text-slate-900 dark:text-white">
                    {m.valor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Regiões */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            Valores por região do Brasil
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Consulte a faixa de frete e a partir de quanto vale frete grátis na
            sua região 👇
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {regioes.map((r) => (
            <div key={r.nome} className="card p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-4xl">{r.flag}</span>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Região {r.nome}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{r.cidades}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4" /> Frete PAC
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {r.frete}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50">
                  <span className="text-green-700 dark:text-green-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4" /> FRETE GRÁTIS
                  </span>
                  <span className="font-bold text-green-800 dark:text-green-300">
                    {r.gratis}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Funcionamento envio */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200/50 dark:border-green-900/30">
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" /> Como funciona
            o envio
          </h3>
          <ol className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
            {[
              "Aprovou o pagamento? Separamos seu pedido em até 24h úteis.",
              "Postamos nos Correios e enviamos o código de rastreio por e-mail + WhatsApp.",
              "Acompanhe em Minha Conta → Pedidos — atualizações automáticas a cada evento.",
              "Quando chegar, corre para vestir sua nova peça favorita! 💜",
            ].map((passo, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{passo}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6 md:p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-900/30">
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Avisos
            importantes
          </h3>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
            {[
              "Tentativa de entrega sem destinatário: a transportadora faz 02 tentativas, caso não consiga, o pedido volta para a nossa loja.",
              "Confira o endereço com atenção! Endereço errado = atraso na entrega.",
              "Produto de outra transportadora? Não, trabalhamos apenas com parceiros homologados (Correios e Jadlog).",
              "Não precisa imprimir nada para retirar na loja: basta o documento com foto!",
            ].map((av, i) => (
              <li key={i} className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{av}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Dúvidas frequentes sobre entrega
          </h2>
        </div>
        <div className="space-y-3">
          {[
            [
              "Posso agendar horário de entrega?",
              "Infelizmente a agendagem depende exclusivamente da política dos Correios/transportadora, não temos controle sobre isso. Fique ligado no seu telefone que o carteiro pode ligar!",
            ],
            [
              "Meu pedido parou no rastreio, e agora?",
              "Se o status ficar o mesmo por mais de 4 dias úteis, abre aí uma solicitação no nosso WhatsApp (83) 99999-0000 que a gente resolve direitinho com o seguro!",
            ],
            [
              "Como funciona o frete grátis?",
              "Automatico! Basta o valor do carrinho (antes de cupons e descontos) bater o valor mínimo da sua região. A gente aplica lá pro você sem precisar de cupom.",
            ],
            [
              "Quanto tempo até postar meu pedido?",
              "Pedidos aprovados até 14h são postados no mesmo dia útil! Depois disso, no dia útil seguinte.",
            ],
          ].map(([q, a], i) => (
            <details
              key={q}
              className="group card p-5 open:shadow-md transition"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-slate-800 dark:text-slate-200 pr-2 min-h-[48px]">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-primary font-bold">
                    Q{i + 1}.
                  </span>
                  {q}
                </span>
                <span className="text-primary text-2xl transition group-open:rotate-45 flex-shrink-0">
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

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 md:p-10 text-white text-center shadow-xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
          Pronto para receber sua nova peça favorita na sua porta? 📦
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Corre que a Moda Center Santa Cruz entrega rapidinho para todo o
          Brasil — e com frete grátis nas compras acima do valor da sua região!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/produtos"
            className="btn !bg-white !text-primary hover:!bg-white/90 min-h-[52px] px-8 text-base font-bold"
          >
            <Sparkles className="w-5 h-5" /> Ver as coleções
          </Link>
          <Link
            href="/contato"
            className="btn !bg-white/15 hover:!bg-white/25 !border-white/30 min-h-[52px] px-8 text-base"
          >
            <MessageCircleHeart className="w-5 h-5" /> Falar com atendimento
          </Link>
        </div>
      </div>
    </div>
  );
}
