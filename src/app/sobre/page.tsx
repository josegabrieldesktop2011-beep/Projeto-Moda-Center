import {
  Shirt,
  Star,
  Users,
  Award,
  Truck,
  Heart,
  MapPin,
  ArrowLeft,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sobre a Moda Center Santa Cruz",
  description:
    "Conheça a história, missão e valores da Moda Center Santa Cruz, referência em moda popular no Nordeste.",
};

const timeline = [
  {
    ano: "1995",
    titulo: "Fundação",
    desc: "Nascida no coração de Santa Cruz do Capibaribe, a Moda Center começou como uma pequena loja de roupas familiares, com o sonho de vestir a população com qualidade e preço justo.",
  },
  {
    ano: "2008",
    titulo: "Expansão",
    desc: "Inauguramos nossa loja matriz de 3.000m² no centro da cidade, nos consolidando como referência em moda popular em todo o Agreste Pernambucano.",
  },
  {
    ano: "2015",
    titulo: "E-commerce",
    desc: "Lançamos nossa loja virtual para levar a qualidade da Moda Center SC para todo o Brasil. Hoje atendemos os 26 estados + DF.",
  },
  {
    ano: "2020",
    titulo: "Reconhecimento",
    desc: "Prêmio Top Empresarial Brasil — Melhor Loja de Moda Popular do Nordeste, com mais de 500 mil clientes atendidos.",
  },
  {
    ano: "2024",
    titulo: "Nova Era",
    desc: "Relançamento da plataforma omnicanal com app próprio, checkout em 3 passos e o melhor atendimento do mercado. Você é nossa prioridade!",
  },
];

export default function SobrePage() {
  return (
    <div className="container-pad py-8 md:py-12 max-w-5xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-indigo-700 p-8 md:p-14 text-white shadow-2xl mb-10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase mb-5">
            <Sparkles className="w-4 h-4" /> Há quase 30 anos vestindo você
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight max-w-3xl">
            Moda que veste a sua{" "}
            <span className="text-amber-300 underline decoration-white/30">
              história
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            Mais que uma loja de roupas, somos parte da sua trajetória. Do
            primeiro dia de aula ao casamento, da entrevista ao passeio em
            família: vestimos sonhos com preço que cabe no bolso.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: "500k+", l: "Clientes felizes", icon: Users },
              { n: "18 mil", l: "Produtos variados", icon: Shirt },
              { n: "26+1", l: "Estados atendidos", icon: MapPin },
              { n: "4.9★", l: "Avaliação média", icon: Star },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.l}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <Icon className="w-5 h-5 mb-2 text-amber-300" />
                  <p className="text-2xl md:text-3xl font-extrabold">{k.n}</p>
                  <p className="text-xs md:text-sm text-white/80 mt-1">{k.l}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Missão Visão Valores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: Target,
            title: "Missão",
            color: "from-primary to-purple-500",
            desc: "Oferecer moda de qualidade e democrática, permitindo que cada pessoa expresse sua personalidade com roupas bonitas, confortáveis e com preço justo.",
          },
          {
            icon: Star,
            title: "Visão",
            color: "from-gold to-amber-500",
            desc: "Ser a marca de moda popular mais amada do Brasil, reconhecida pelo atendimento humano, variedade de produtos e presença omnicanal (loja física + e-commerce + app).",
          },
          {
            icon: Heart,
            title: "Valores",
            color: "from-rose-500 to-pink-500",
            desc: "Amor pelo cliente · Ética em primeiro lugar · Qualidade sem ostentação · Inovação com simplicidade · Respeito à diversidade · Trabalho em família.",
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="card p-6 hover:-translate-y-1 transition-transform"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                {c.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Linha do tempo */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Nossa história
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Uma trajetória construída com muito trabalho, dedicação e, acima de
            tudo, respeito por cada cliente.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-gold" />
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <div
                key={t.ano}
                className={`relative flex gap-4 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-primary z-10 top-2" />
                <div
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                    i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}
                >
                  <div className="card p-5 border-l-4 md:border-l-0 border-primary hover:shadow-lg transition">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2">
                      <Award className="w-4 h-4" />
                      {t.ano}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {t.titulo}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 text-center border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Vestir-se bem é também contar sua história 💜
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
          Venha fazer parte dessa família de mais de meio milhão de pessoas que
          confiam na Moda Center Santa Cruz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/produtos"
            className="btn btn-primary min-h-[48px] px-8"
          >
            <Shirt className="w-4 h-4" /> Ver nossas coleções
          </Link>
          <Link href="/contato" className="btn btn-outline min-h-[48px] px-8">
            <Truck className="w-4 h-4" /> Fale com a gente
          </Link>
        </div>
      </section>
    </div>
  );
}
