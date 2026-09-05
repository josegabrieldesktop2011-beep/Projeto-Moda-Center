import Link from "next/link";
import {
  FileCheck,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  AlertTriangle,
  Shield,
  MessageSquare,
  Users,
  BookOpen,
  Gavel,
} from "lucide-react";

export const metadata = {
  title: "Termos de Uso | Moda Center Santa Cruz",
  description:
    "Termos e Condições Gerais de Uso e Compra do e-commerce Moda Center Santa Cruz.",
};

const sections = [
  {
    icon: BookOpen,
    title: "1. Aceitação dos Termos",
    p: "Ao acessar ou utilizar o site e os serviços da Moda Center Santa Cruz, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso, com nossa Política de Privacidade e com todas as demais políticas publicadas em nosso site. Caso não concorde com qualquer disposição abaixo, por favor, não utilize nossa plataforma.",
  },
  {
    icon: Users,
    title: "2. Capacidade para Contratar",
    p: "Os serviços da Moda Center Santa Cruz estão disponíveis apenas para pessoas com capacidade legal para contratar (maiores de 18 anos ou emancipados). Menores de idade poderão cadastrar-se e realizar compras apenas com a autorização expressa e acompanhamento dos pais ou responsáveis legais, que serão integralmente responsáveis por todos os atos praticados.",
  },
  {
    icon: ShoppingBag,
    title: "3. Produtos e Ofertas",
    list: [
      "Todas as fotos, descrições e preços dos produtos são meramente ilustrativos e sujeitos a alteração sem aviso prévio;",
      "Ofertas e promoções são válidas exclusivamente durante o período informado e enquanto durarem os estoques;",
      "Variações mínimas de cor e tonalidade podem ocorrer em função da configuração do seu monitor ou dispositivo;",
      "Em caso de divergência entre o preço anunciado no carrinho e o preço da página do produto, prevalecerá sempre o valor exibido no momento da finalização do checkout.",
    ],
  },
  {
    icon: CreditCard,
    title: "4. Pagamento",
    list: [
      "Aceitamos cartão de crédito (Visa, Mastercard, Elo, Hipercard, Amex) em até 12x sem juros, conforme oferta vigente;",
      "PIX com desconto especial e confirmação instantânea;",
      "Boleto bancário com vencimento de até 3 dias úteis e desconto;",
      "Pagamentos são processados pelo gateway Stripe (PCI DSS Nível 1) — jamais armazenamos dados completos de cartão;",
      "A confirmação do pagamento é enviada automaticamente por e-mail em até 5 minutos após a aprovação.",
      "Transações negadas: o cliente é notificado imediatamente por e-mail e notificação push.",
    ],
  },
  {
    icon: Truck,
    title: "5. Entrega e Prazos",
    p: "Os prazos de entrega iniciam-se a contar da confirmação do pagamento e variam conforme a região e a modalidade de frete escolhida (PAC, SEDEX ou retirada em loja). A Moda Center Santa Cruz não se responsabiliza por atrasos decorrentes de greves, fenômenos naturais, problemas na operadora logística ou ausência de destinatário no endereço informado por 02 (duas) tentativas de entrega.",
  },
  {
    icon: Shield,
    title: "6. Política de Trocas e Devoluções",
    p: "Nossos clientes têm direito à troca ou devolução em até 30 (trinta) dias corridos após o recebimento do produto, conforme o CDC (Código de Defesa do Consumidor). Arrependimento: devolução do valor pago integralmente, incluindo frete. Produtos devem ser enviados na embalagem original, sem sinais de uso e acompanhados de nota fiscal. O procedimento completo está descrito na página Política de Trocas.",
  },
  {
    icon: MessageSquare,
    title: "7. Atendimento ao Cliente",
    p: "Estamos à disposição para solucionar qualquer dúvida, problema ou reclamação através dos nossos canais oficiais: Chat integrado no site e no pedido, WhatsApp (83) 99999-0000 (atendimento humano), E-mail contato@modacentersc.com.br, Telefone SAC 0800 e Central de Ajuda. Nosso compromisso é responder a todas as solicitações em até 24 horas úteis.",
  },
  {
    icon: AlertTriangle,
    title: "8. Responsabilidades e Limitações",
    p: "A Moda Center Santa Cruz envidará todos os esforços razoáveis para manter a plataforma disponível 24 horas por dia. No entanto, não garante acesso ininterrupto e livre de erros, ficando isenta de responsabilidade por eventuais danos decorrentes de indisponibilidades temporárias para manutenção, ataques cibernéticos, falhas de rede de internet ou de energia elétrica que estejam fora do seu controle.",
  },
  {
    icon: Gavel,
    title: "9. Disposições Gerais",
    list: [
      "Estes Termos são regidos pela legislação brasileira;",
      "Fórum competente: Comarca de Santa Cruz do Capibaribe, Pernambuco;",
      "Qualquer tolerância no exercício de um direito não constitui renúncia;",
      "Se qualquer cláusula for considerada inválida, as demais permanecem em pleno vigor;",
      "Podemos atualizar estes Termos periodicamente — a versão vigente é sempre a publicada nesta página.",
    ],
  },
];

export default function TermosPage() {
  return (
    <div className="container-pad py-8 md:py-12 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      <header className="mb-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mx-auto mb-5 shadow-xl">
          <FileCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Termos e Condições de Uso
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-3">
          Regras gerais para uso do site e realização de compras
        </p>
        <p className="text-sm text-slate-500">
          Vigência:{" "}
          <b className="text-slate-700 dark:text-slate-300">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </b>
        </p>
      </header>

      <article className="card p-6 md:p-10 space-y-8 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <section key={s.title}>
              <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                {s.title}
              </h2>
              <div className="pl-0 md:pl-13 space-y-3">
                {s.p && <p>{s.p}</p>}
                {s.list && (
                  <ul className="space-y-2">
                    {s.list.map((li, i) => (
                      <li
                        key={i}
                        className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl"
                      >
                        <span className="text-primary font-bold flex-shrink-0">
                          ▸
                        </span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          );
        })}
      </article>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Dúvidas sobre estes Termos? Nossa equipe está à disposição através dos
          canais na página{" "}
          <Link
            href="/contato"
            className="text-primary font-semibold hover:underline"
          >
            Fale Conosco
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
