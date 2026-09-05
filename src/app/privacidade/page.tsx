import Link from "next/link";
import {
  Shield,
  User,
  Lock,
  Eye,
  Trash2,
  FileText,
  Cookie,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Moda Center Santa Cruz",
  description:
    "Conheça como a Moda Center Santa Cruz coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
};

const topics = [
  {
    icon: User,
    title: "1. Quem somos nós",
    content: [
      "A Moda Center Santa Cruz (" ,
      "CNPJ 12.345.678/0001-90" ,
      "), com sede em Santa Cruz do Capibaribe/PE, é a controladora dos dados pessoais coletados através deste site e aplicativo. Esta Política de Privacidade rege a forma como tratamos as informações dos nossos usuários e clientes, em total conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).",
    ],
  },
  {
    icon: Eye,
    title: "2. Quais dados coletamos",
    content: [
      "Coletamos apenas os dados estritamente necessários para prestar o melhor serviço. São eles:",
    ],
    list: [
      "Dados de cadastro: nome, e-mail, CPF/CNPJ, telefone, data de nascimento;",
      "Dados de endereço: rua, número, bairro, cidade, estado, CEP, ponto de referência;",
      "Dados de navegação: IP, dispositivo, páginas acessadas, horários (anônimos quando possível);",
      "Dados de pagamento: processados diretamente pelo gateway Stripe (PCI DSS). NÃO armazenamos número completo de cartão — apenas 4 últimos dígitos, bandeira e parcelas;",
      "Fotos e textos enviados em avaliações de produtos e mensagens de atendimento;",
      "Preferências de notificação (push, e-mail, WhatsApp).",
    ],
  },
  {
    icon: CheckCircle2,
    title: "3. Para que usamos seus dados",
    list: [
      "✅ Cumprir com o contrato de compra e venda (entrega do produto, emissão de NF-e);",
      "✅ Processar pagamentos, verificar fraudes e prevenir abusos;",
      "✅ Enviar confirmações de pedido, atualizações de status e comprovantes;",
      "✅ Oferecer suporte e atendimento ao cliente via chat, WhatsApp e e-mail;",
      "✅ Personalizar a experiência: recomendar produtos, relembrar carrinho abandonado;",
      "✅ Enviar promoções, cupons e novidades (com seu consentimento explícito — opção de cancelar a qualquer momento);",
      "✅ Cumprir obrigações legais (fiscais, tributárias, atendimento a ordens judiciais);",
      "✅ Melhorar nosso site com métricas anônimas de navegação (Google Analytics 4).",
    ],
  },
  {
    icon: Lock,
    title: "4. Como protegemos seus dados",
    content: [
      "A segurança dos seus dados é prioridade máxima em nossa operação:",
    ],
    list: [
      "🔐 Criptografia SSL/TLS (HTTPS) em todas as páginas;",
      "🔐 Senhas com hash bcrypt de 12 rounds (irreversíveis);",
      "🔐 Dados sensíveis (CPF, endereço, cartão) criptografados em repouso no banco;",
      "🔐 Gateway de pagamento certificado PCI DSS Nível 1 (Stripe);",
      "🔐 Backups diários criptografados armazenados em nuvem privada;",
      "🔐 Acesso a dados pessoais restrito apenas a colaboradores autorizados;",
      "🔐 Política interna de segurança e NDA assinado por toda a equipe.",
    ],
  },
  {
    icon: Cookie,
    title: "5. Cookies e tecnologias similares",
    content: [
      "Usamos cookies para lembrar suas preferências e entender como você usa nosso site. Classificamo-los em:",
    ],
    list: [
      "🍪 Essenciais: obrigatórios para funcionamento do carrinho e checkout;",
      "🍪 Funcionais: lembram login, cep pesquisado, produtos favoritos;",
      "🍪 Analíticos: nos ajudam a entender o que funciona e melhorar (anonimizados);",
      "🍪 Marketing: mostram anúncios de nossos produtos em outras plataformas (apenas com seu OK).",
    ],
    contentEnd: [
      "Você pode bloquear ou limpar cookies diretamente no seu navegador — isso pode afetar algumas funcionalidades do site.",
    ],
  },
  {
    icon: FileText,
    title: "6. Compartilhamento de dados",
    content: [
      "NÃO vendemos seus dados para terceiros. Compartilhamos APENAS quando necessário e com parceiros homologados:",
    ],
    list: [
      "🏦 Stripe (pagamentos) — PCI DSS;",
      "📦 Correios / transportadoras (entrega dos pedidos);",
      "📧 Resend / SendGrid (envio de e-mails transacionais);",
      "🔥 Firebase (notificações push no app);",
      "⚖️ Cumprimento de ordens judiciais ou requisições de órgãos competentes.",
    ],
  },
  {
    icon: User,
    title: "7. Seus direitos como titular (LGPD)",
    content: [
      "Você é dono(a) dos seus dados! A LGPD garante a você o direito de:",
    ],
    list: [
      "✋ Confirmar a existência de tratamento dos seus dados;",
      "👁️ Acessar e baixar cópia dos seus dados pessoais (portabilidade);",
      "✏️ Corrigir dados incompletos, inexatos ou desatualizados;",
      "♻️ Anonimizar, bloquear ou eliminar dados desnecessários;",
      "🚫 Retirar seu consentimento a qualquer momento;",
      "📤 Solicitar a portabilidade dos seus dados para outro fornecedor;",
      "🔥 Excluir todos os seus dados da nossa base (direito ao esquecimento).",
    ],
    contentEnd: [
      "Para exercer qualquer direito acima, basta acessar ",
      <Link
        key="excluir"
        href="/exclusao-dados"
        className="text-primary font-semibold hover:underline"
      >
        nossa página de solicitação de exclusão
      </Link>,
      " enviar um e-mail para nosso Encarregado de Dados (DPO). Prazo de resposta e execução: até 15 dias corridos.",
    ],
  },
  {
    icon: Trash2,
    title: "8. Retenção e exclusão de dados",
    content: [
      "Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades acima:",
    ],
    list: [
      "Dados de pedidos e NF-e: 5 anos (Lei do Imposto de Renda);",
      "Logs de segurança e auditoria: 90 dias;",
      "Carrinho abandonado: 30 dias;",
      "Preferências de marketing: até o momento do cancelamento.",
    ],
  },
  {
    icon: MapPin,
    title: "9. Contato do Encarregado (DPO)",
    content: [
      "Nosso Encarregado de Proteção de Dados está à disposição para qualquer dúvida ou solicitação:",
    ],
    list: [
      "👤 Nome: Equipe de Privacidade Moda Center SC",
      "📧 E-mail: privacidade@modacentersc.com.br",
      "📞 Telefone/WhatsApp: (83) 3211-0000",
      "📍 Endereço: Av. Santa Cruz, 1000 - Centro, Santa Cruz do Capibaribe/PE",
    ],
  },
  {
    icon: Shield,
    title: "10. Alterações nesta política",
    content: [
      "Esta política pode ser atualizada periodicamente para refletir melhorias no nosso tratamento de dados ou mudanças legislativas. A versão mais recente sempre estará publicada nesta página, com data da última atualização abaixo. Mudanças materiais serão comunicadas por e-mail aos clientes cadastrados.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <div className="container-pad py-8 md:py-12 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6 min-h-[48px]"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a página inicial
      </Link>

      <header className="mb-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-5 shadow-xl">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Política de Privacidade
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-3">
          Última atualização:{" "}
          <b className="text-slate-700 dark:text-slate-300">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </b>
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
          <CheckCircle2 className="w-4 h-4" />
          100% em conformidade com a LGPD (Lei 13.709/2018)
        </div>
      </header>

      <article className="card p-6 md:p-10 space-y-8 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <section key={t.title} id={t.title.toLowerCase().replace(/\W+/g, "-")}>
              <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                {t.title}
              </h2>
              <div className="space-y-3 pl-0 md:pl-13">
                {t.content && (
                  <p>
                    {t.content.map((part, idx) =>
                      typeof part === "string" ? (
                        <span key={idx}>{part}</span>
                      ) : (
                        part
                      )
                    )}
                  </p>
                )}
                {t.list && (
                  <ul className="space-y-2 mt-3">
                    {t.list.map((li, i) => (
                      <li
                        key={i}
                        className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl"
                      >
                        <span className="text-slate-400">•</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {t.contentEnd && (
                  <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
                    {t.contentEnd.map((part, idx) =>
                      typeof part === "string" ? (
                        <span key={idx}>{part}</span>
                      ) : (
                        part
                      )
                    )}
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </article>

      <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" /> Dúvidas? Fale com nosso DPO em{" "}
          <a
            href="mailto:privacidade@modacentersc.com.br"
            className="text-primary font-semibold hover:underline"
          >
            privacidade@modacentersc.com.br
          </a>
        </p>
        <p className="mt-2">
          <Phone className="w-4 h-4 inline mr-1.5" />
          (83) 3211-0000 • Horário comercial: seg a sáb, 8h às 18h
        </p>
      </footer>
    </div>
  );
}
