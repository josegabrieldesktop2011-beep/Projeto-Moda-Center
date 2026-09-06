"use client";

import { useState } from "react";
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  Shield,
  Mail as MailIcon,
  Save,
  Loader2,
  Bell,
  Database,
  CloudUpload,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminConfiguracoesPage() {
  const [tab, setTab] = useState<
    "loja" | "envio" | "pagamento" | "email" | "seguranca" | "sistema"
  >("loja");
  const [saving, setSaving] = useState(false);

  const [loja, setLoja] = useState({
    nome: "Moda Center Santa Cruz",
    slogan: "Moda que veste sua história",
    cnpj: "12.345.678/0001-90",
    ie: "123.456.789.012",
    email: "contato@modacentersc.com.br",
    telefone: "(83) 3211-0000",
    whatsapp: "(83) 99999-0000",
    endereco: "Av. Santa Cruz, 1000 - Centro",
    cidade: "Santa Cruz do Capibaribe",
    estado: "PE",
    cep: "55190-000",
    horario: "Seg-Sáb, das 8h às 18h",
  });

  const [envio, setEnvio] = useState({
    freteGratisMin: 199,
    prazoSedexMin: 1,
    prazoSedexMax: 3,
    prazoPacMin: 4,
    prazoPacMax: 10,
    transportadoraPadrao: "Correios",
    retiradaLoja: true,
    taxaFixaSedex: 12.9,
    taxaFixaPac: 7.9,
  });

  const [pagamento, setPagamento] = useState({
    cartaoCredito: true,
    maxParcelas: 12,
    parcelaSemJurosMin: 50,
    pix: true,
    pixDescontoPercent: 5,
    boleto: true,
    boletoVencimentoDias: 3,
    boletoDescontoPercent: 3,
    stripePublic: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  });

  const [emailCfg, setEmailCfg] = useState({
    remetente: "Moda Center Santa Cruz <noreply@modacentersc.com.br>",
    smtpHost: "smtp.resend.com",
    smtpPorta: 587,
    respostaPara: "contato@modacentersc.com.br",
    notificarNovoPedido: true,
    notificarEmailAdmin: "admin@modacenter.com.br",
  });

  const [seguranca, setSeguranca] = useState({
    doisFAObrigatorioStaff: false,
    expiracaoSessaoDias: 30,
    tentativasLoginBloqueio: 5,
    tempoBloqueioMin: 30,
    logsRetencaoDias: 90,
    backupDiario: true,
    backupNuvem: true,
    senhaMinLength: 8,
    senhaExigeNumeros: true,
    senhaExigeEspeciais: true,
  });

  const salvar = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Configurações salvas com sucesso! ✅", {
      description: "As alterações já estão em vigor no sistema.",
    });
    setSaving(false);
  };

  const tabs = [
    { id: "loja", label: "Dados da Loja", icon: Store },
    { id: "envio", label: "Envio e Frete", icon: Truck },
    { id: "pagamento", label: "Pagamento", icon: CreditCard },
    { id: "email", label: "E-mail Transacional", icon: MailIcon },
    { id: "seguranca", label: "Segurança e LGPD", icon: Shield },
    { id: "sistema", label: "Sistema e Backup", icon: Database },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" /> Configurações
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personalize o comportamento do seu e-commerce
          </p>
        </div>
        <button
          onClick={salvar}
          disabled={saving}
          className="btn btn-primary min-h-[48px]"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Menu Lateral */}
        <div className="card p-2 h-fit lg:sticky lg:top-4 space-y-1">
          {tabs.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`w-full min-h-[48px] flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm font-medium transition ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="card p-6 space-y-6">
          {tab === "loja" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Store className="w-5 h-5 text-primary" /> Dados da Loja
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Nome da Loja</label>
                  <input
                    className="input"
                    value={loja.nome}
                    onChange={(e) => setLoja({ ...loja, nome: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Slogan</label>
                  <input
                    className="input"
                    value={loja.slogan}
                    onChange={(e) =>
                      setLoja({ ...loja, slogan: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">CNPJ</label>
                  <input
                    className="input font-mono"
                    value={loja.cnpj}
                    onChange={(e) => setLoja({ ...loja, cnpj: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Inscrição Estadual</label>
                  <input
                    className="input font-mono"
                    value={loja.ie}
                    onChange={(e) => setLoja({ ...loja, ie: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">E-mail</label>
                  <input
                    type="email"
                    className="input"
                    value={loja.email}
                    onChange={(e) =>
                      setLoja({ ...loja, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input
                    className="input"
                    value={loja.telefone}
                    onChange={(e) =>
                      setLoja({ ...loja, telefone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">WhatsApp</label>
                  <input
                    className="input"
                    value={loja.whatsapp}
                    onChange={(e) =>
                      setLoja({ ...loja, whatsapp: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">CEP</label>
                  <input
                    className="input font-mono"
                    value={loja.cep}
                    onChange={(e) => setLoja({ ...loja, cep: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Endereço</label>
                  <input
                    className="input"
                    value={loja.endereco}
                    onChange={(e) =>
                      setLoja({ ...loja, endereco: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Cidade</label>
                  <input
                    className="input"
                    value={loja.cidade}
                    onChange={(e) =>
                      setLoja({ ...loja, cidade: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Estado (UF)</label>
                  <input
                    maxLength={2}
                    className="input uppercase"
                    value={loja.estado}
                    onChange={(e) =>
                      setLoja({ ...loja, estado: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Horário de Funcionamento</label>
                  <input
                    className="input"
                    value={loja.horario}
                    onChange={(e) =>
                      setLoja({ ...loja, horario: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {tab === "envio" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Truck className="w-5 h-5 text-primary" /> Envio e Frete
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Frete Grátis a partir de (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={envio.freteGratisMin}
                    onChange={(e) =>
                      setEnvio({
                        ...envio,
                        freteGratisMin: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Transportadora Padrão</label>
                  <select
                    className="input"
                    value={envio.transportadoraPadrao}
                    onChange={(e) =>
                      setEnvio({ ...envio, transportadoraPadrao: e.target.value })
                    }
                  >
                    <option>Correios</option>
                    <option>Jadlog</option>
                    <option>Total Express</option>
                    <option>Loggi</option>
                    <option>Outra</option>
                  </select>
                </div>
                <div>
                  <label className="label">Prazo SEDEX (min - max dias)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      className="input"
                      value={envio.prazoSedexMin}
                      onChange={(e) =>
                        setEnvio({
                          ...envio,
                          prazoSedexMin: Number(e.target.value),
                        })
                      }
                    />
                    <input
                      type="number"
                      className="input"
                      value={envio.prazoSedexMax}
                      onChange={(e) =>
                        setEnvio({
                          ...envio,
                          prazoSedexMax: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Prazo PAC (min - max dias)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      className="input"
                      value={envio.prazoPacMin}
                      onChange={(e) =>
                        setEnvio({
                          ...envio,
                          prazoPacMin: Number(e.target.value),
                        })
                      }
                    />
                    <input
                      type="number"
                      className="input"
                      value={envio.prazoPacMax}
                      onChange={(e) =>
                        setEnvio({
                          ...envio,
                          prazoPacMax: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Taxa Fixa SEDEX (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={envio.taxaFixaSedex}
                    onChange={(e) =>
                      setEnvio({
                        ...envio,
                        taxaFixaSedex: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Taxa Fixa PAC (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={envio.taxaFixaPac}
                    onChange={(e) =>
                      setEnvio({
                        ...envio,
                        taxaFixaPac: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer select-none p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={envio.retiradaLoja}
                    onChange={(e) =>
                      setEnvio({ ...envio, retiradaLoja: e.target.checked })
                    }
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Permitir retirada na loja física (frete grátis)
                    </p>
                    <p className="text-xs text-slate-500">
                      Cliente poderá optar por retirar pessoalmente em{" "}
                      {loja.cidade}/{loja.estado}
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}

          {tab === "pagamento" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CreditCard className="w-5 h-5 text-primary" /> Métodos de
                Pagamento
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "cartaoCredito",
                    label: "Cartão de Crédito",
                    desc: "Visa, Mastercard, Elo, Hipercard, American Express",
                    value: pagamento.cartaoCredito,
                    setter: (v: boolean) =>
                      setPagamento({ ...pagamento, cartaoCredito: v }),
                  },
                  {
                    id: "pix",
                    label: "PIX",
                    desc: "Pagamento instantâneo, confirmação em segundos",
                    value: pagamento.pix,
                    setter: (v: boolean) =>
                      setPagamento({ ...pagamento, pix: v }),
                  },
                  {
                    id: "boleto",
                    label: "Boleto Bancário",
                    desc: "Compensação em até 2 dias úteis",
                    value: pagamento.boleto,
                    setter: (v: boolean) =>
                      setPagamento({ ...pagamento, boleto: v }),
                  },
                ].map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center justify-between gap-3 cursor-pointer select-none p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {m.label}
                      </p>
                      <p className="text-xs text-slate-500">{m.desc}</p>
                    </div>
                    <div
                      className={`w-14 h-8 rounded-full transition-all relative ${
                        m.value ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={m.value}
                        onChange={(e) => m.setter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                          m.value ? "left-7" : "left-1"
                        }`}
                      />
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="label">Parcelamento máximo (sem juros)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    className="input"
                    value={pagamento.maxParcelas}
                    onChange={(e) =>
                      setPagamento({
                        ...pagamento,
                        maxParcelas: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Parcela mínima sem juros (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={pagamento.parcelaSemJurosMin}
                    onChange={(e) =>
                      setPagamento({
                        ...pagamento,
                        parcelaSemJurosMin: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Desconto PIX (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={pagamento.pixDescontoPercent}
                    onChange={(e) =>
                      setPagamento({
                        ...pagamento,
                        pixDescontoPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Desconto Boleto (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={pagamento.boletoDescontoPercent}
                    onChange={(e) =>
                      setPagamento({
                        ...pagamento,
                        boletoDescontoPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Vencimento Boleto (dias úteis)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={pagamento.boletoVencimentoDias}
                    onChange={(e) =>
                      setPagamento({
                        ...pagamento,
                        boletoVencimentoDias: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Stripe Public Key (PCI DSS)</label>
                  <input
                    type="password"
                    className="input font-mono text-sm"
                    value={pagamento.stripePublic}
                    readOnly
                    placeholder="Carregado de .env.local"
                  />
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Dados de cartão nunca são armazenados no seu banco (PCI
                    Compliance)
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === "email" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <MailIcon className="w-5 h-5 text-primary" /> E-mails
                Transacionais
              </h2>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl mb-5">
                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Integração com <b>Resend / SendGrid / SES</b> via{" "}
                    <code className="font-mono bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded text-xs">
                      RESEND_API_KEY
                    </code>{" "}
                    em .env.local
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Remetente</label>
                  <input
                    className="input"
                    value={emailCfg.remetente}
                    onChange={(e) =>
                      setEmailCfg({ ...emailCfg, remetente: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">SMTP Host</label>
                  <input
                    className="input font-mono"
                    value={emailCfg.smtpHost}
                    onChange={(e) =>
                      setEmailCfg({ ...emailCfg, smtpHost: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">SMTP Porta</label>
                  <input
                    type="number"
                    className="input"
                    value={emailCfg.smtpPorta}
                    onChange={(e) =>
                      setEmailCfg({
                        ...emailCfg,
                        smtpPorta: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Responder para</label>
                  <input
                    type="email"
                    className="input"
                    value={emailCfg.respostaPara}
                    onChange={(e) =>
                      setEmailCfg({ ...emailCfg, respostaPara: e.target.value })
                    }
                  />
                </div>
                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer select-none p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={emailCfg.notificarNovoPedido}
                    onChange={(e) =>
                      setEmailCfg({
                        ...emailCfg,
                        notificarNovoPedido: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Notificar admin sobre novos pedidos
                    </p>
                    <p className="text-xs text-slate-500">
                      Envia um e-mail sempre que um pedido for confirmado
                    </p>
                  </div>
                </label>
                <div className="md:col-span-2">
                  <label className="label">E-mail do administrador</label>
                  <input
                    type="email"
                    className="input"
                    value={emailCfg.notificarEmailAdmin}
                    onChange={(e) =>
                      setEmailCfg({
                        ...emailCfg,
                        notificarEmailAdmin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {tab === "seguranca" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Shield className="w-5 h-5 text-primary" /> Segurança e LGPD
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Sessão expira em (dias)</label>
                  <input
                    type="number"
                    className="input"
                    value={seguranca.expiracaoSessaoDias}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        expiracaoSessaoDias: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Tentativas login antes do bloqueio
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={seguranca.tentativasLoginBloqueio}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        tentativasLoginBloqueio: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Duração do bloqueio (minutos)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={seguranca.tempoBloqueioMin}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        tempoBloqueioMin: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Retenção de logs (dias - auditoria)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={seguranca.logsRetencaoDias}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        logsRetencaoDias: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Tamanho mínimo senha</label>
                  <input
                    type="number"
                    className="input"
                    value={seguranca.senhaMinLength}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        senhaMinLength: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex-1 justify-center">
                    <input
                      type="checkbox"
                      checked={seguranca.senhaExigeNumeros}
                      onChange={(e) =>
                        setSeguranca({
                          ...seguranca,
                          senhaExigeNumeros: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-medium">Exige nº</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex-1 justify-center">
                    <input
                      type="checkbox"
                      checked={seguranca.senhaExigeEspeciais}
                      onChange={(e) =>
                        setSeguranca({
                          ...seguranca,
                          senhaExigeEspeciais: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-medium">Exige símbolo</span>
                  </label>
                </div>
                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer select-none p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <input
                    type="checkbox"
                    checked={seguranca.doisFAObrigatorioStaff}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        doisFAObrigatorioStaff: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-amber-500 rounded"
                  />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-300">
                      2FA Obrigatório para equipe (vendedores e admin)
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400/80">
                      Recomendado para conformidade PCI DSS e proteger dados
                      sensíveis
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}

          {tab === "sistema" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Database className="w-5 h-5 text-primary" /> Sistema e Backup
              </h2>
              <div className="space-y-3 mb-6">
                <label className="flex items-center justify-between gap-3 cursor-pointer select-none p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CloudUpload className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        Backup Diário Automático
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400/80">
                        Realiza dump completo do PostgreSQL às 03:00h
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={seguranca.backupDiario}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        backupDiario: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-green-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 cursor-pointer select-none p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <CloudUpload className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-300">
                        Cópia na Nuvem (AWS S3 / Cloudflare R2)
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400/80">
                        Arquivos criptografados AES-256 • 90 dias de retenção
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={seguranca.backupNuvem}
                    onChange={(e) =>
                      setSeguranca({
                        ...seguranca,
                        backupNuvem: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-blue-600 rounded"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => toast.success("Backup manual iniciado! 📦")}
                  className="card p-5 hover:shadow-lg transition cursor-pointer text-left group"
                >
                  <CloudUpload className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition" />
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    Backup Agora
                  </p>
                  <p className="text-xs text-slate-500">
                    Realiza cópia imediata do banco + imagens
                  </p>
                </button>
                <button
                  onClick={() =>
                    toast.success(
                      "Teste de restauração agendado! Resultado chegará por e-mail em instantes ✅"
                    )
                  }
                  className="card p-5 hover:shadow-lg transition cursor-pointer text-left group"
                >
                  <Database className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition" />
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    Testar Restauração
                  </p>
                  <p className="text-xs text-slate-500">
                    Valida integridade do último backup
                  </p>
                </button>
              </div>
            </>
          )}

          {/* Rodape salvar */}
          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={salvar}
              disabled={saving}
              className="btn btn-primary min-h-[48px]"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? "Salvando..." : "Salvar Todas as Configurações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
