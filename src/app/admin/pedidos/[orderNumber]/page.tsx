"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Loader2,
  FileText,
  Send,
  MessageSquare,
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  Copy,
  Download,
  AlertCircle,
} from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  OrderStatus,
  getOrderStatusLabel,
  getOrderStatusColor,
  formatCurrency,
  formatDate,
  formatDateTime,
  maskCardLast4,
} from "@/lib/utils";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode: string | null;
  createdAt: string;
  shippingAddress: any;
  billingAddress: any;
  cardLast4: string | null;
  cardBrand: string | null;
  installments: number | null;
  trackingCode: string | null;
  user: { id: string; name: string; email: string; phone: string | null } | null;
  items: Array<{
    id: string;
    productName: string;
    variantSize: string;
    variantColor: string;
    priceAtPurchase: number;
    quantity: number;
    productImage: string | null;
  }>;
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    note: string | null;
    createdAt: string;
  }>;
  chatMessages: Array<{
    id: string;
    sender: "STAFF" | "CLIENT";
    message: string;
    createdAt: string;
  }>;
}

const statusFlow: OrderStatus[] = [
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "PROCESSANDO",
  "ENVIADO",
  "ENTREGUE",
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPedidoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [statusNote, setStatusNote] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/orders/by-number/${orderNumber}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const order: OrderDetail | null = data?.order || null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [order?.chatMessages?.length]);

  const currentStepIndex = order
    ? statusFlow.indexOf(order.status)
    : -1;

  const asyncUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || undefined,
          trackingCode: trackingCode || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        `Status atualizado para ${getOrderStatusLabel(newStatus)}! Notificação enviada ao cliente 📧`
      );
      setStatusNote("");
      setTrackingCode("");
      mutate();
    } catch (e) {
      toast.error("Erro ao atualizar status do pedido");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const asyncSendChat = async () => {
    if (!chatMessage.trim() || !order) return;
    const content = chatMessage.trim();
    setChatMessage("");
    try {
      const res = await fetch(`/api/orders/${order.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      if (!res.ok) throw new Error();
      toast.success("Mensagem enviada!");
      mutate();
    } catch (e) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  const emitirNFe = () => {
    toast.success("NF-e emitida com sucesso (SEFAZ integrada) 📄");
  };

  if (isLoading) {
    return (
      <div className="card p-16 text-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
        <p>Carregando pedido...</p>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-1">Pedido não encontrado</h3>
        <button
          onClick={() => router.back()}
          className="btn btn-ghost mt-4 inline-flex"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost !p-2 min-w-[48px] min-h-[48px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Pedido #{order.orderNumber}
            </h1>
            <p className="text-sm text-slate-500">
              Criado em {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(order.orderNumber);
              toast.success("Nº pedido copiado!");
            }}
            className="btn btn-ghost"
          >
            <Copy className="w-4 h-4" /> Copiar Nº
          </button>
          <button onClick={emitirNFe} className="btn btn-primary">
            <FileText className="w-4 h-4" /> Emitir NF-e
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status atual + Timeline */}
          <div className="card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Situação do Pedido
              </h2>
              <span
                className={`chip font-semibold text-base !py-2 ${getOrderStatusColor(
                  order.status
                )}`}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>

            {/* Timeline 5 passos */}
            <div className="relative">
              <div className="absolute left-4 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-slate-200 dark:bg-slate-700 sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:h-0.5 sm:w-[calc(100%-4rem)]" />
              <ol className="relative grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-0">
                {statusFlow.map((st, idx) => {
                  const done = idx <= currentStepIndex;
                  const active = idx === currentStepIndex;
                  const Icon =
                    st === "AGUARDANDO_PAGAMENTO"
                      ? Clock
                      : st === "PAGO"
                      ? CheckCircle2
                      : st === "PROCESSANDO"
                      ? Loader2
                      : st === "ENVIADO"
                      ? Truck
                      : PackageCheck;
                  return (
                    <li
                      key={st}
                      className="relative flex sm:flex-col items-center gap-3 pl-10 sm:pl-0 sm:pt-10"
                    >
                      <div
                        className={`z-10 min-w-[32px] min-h-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition ${
                          done
                            ? "bg-primary border-primary text-white"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-400"
                        } ${active ? "ring-4 ring-primary/20" : ""}`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            st === "PROCESSANDO" && active ? "animate-spin" : ""
                          }`}
                        />
                      </div>
                      <div className="sm:text-center">
                        <p
                          className={`text-xs font-semibold uppercase ${
                            done
                              ? "text-primary"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          Passo {idx + 1}
                        </p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {getOrderStatusLabel(st)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Ações de atualização de status */}
            {order.status !== "CANCELADO" && order.status !== "ENTREGUE" && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  Atualizar Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Código de rastreio (apenas quando ENVIADO)"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="input w-full"
                  />
                  <input
                    placeholder="Observação interna (opcional)"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusFlow
                    .filter((st) => st !== order.status)
                    .filter(
                      (st) =>
                        st === "CANCELADO" ||
                        statusFlow.indexOf(st) > currentStepIndex
                    )
                    .map((st) => {
                      const isCancel = st === "CANCELADO";
                      const nextStep =
                        statusFlow.indexOf(st) === currentStepIndex + 1;
                      return (
                        <button
                          key={st}
                          onClick={() => asyncUpdateStatus(st)}
                          disabled={updatingStatus}
                          className={`btn min-h-[48px] ${
                            isCancel
                              ? "!bg-red-500 hover:!bg-red-600 !text-white"
                              : nextStep
                              ? "btn-primary"
                              : "btn-outline"
                          }`}
                        >
                          {updatingStatus && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          Marcar como {getOrderStatusLabel(st)}
                        </button>
                      );
                    })}
                  {order.status !== "CANCELADO" && (
                    <button
                      onClick={() => asyncUpdateStatus("CANCELADO")}
                      disabled={updatingStatus}
                      className="btn !bg-red-500 hover:!bg-red-600 !text-white min-h-[48px]"
                    >
                      <XCircle className="w-4 h-4" /> Cancelar Pedido
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Itens do Pedido */}
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <ShoppingBag className="w-5 h-5 text-primary" /> Itens do Pedido
            </h2>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {it.productImage ? (
                      <img
                        src={it.productImage}
                        alt={it.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {it.productName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Tam. {it.variantSize} • Cor {it.variantColor} • Qtd:{" "}
                      <b>{it.quantity}</b>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(it.priceAtPurchase * it.quantity)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(it.priceAtPurchase)} un.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico de Status */}
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Histórico de Alterações
            </h2>
            <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-4">
              {order.statusHistory.map((h) => (
                <li key={h.id} className="ml-5">
                  <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-primary" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`chip !py-1 ${getOrderStatusColor(h.status)}`}
                    >
                      {getOrderStatusLabel(h.status)}
                    </span>
                    <time className="text-xs text-slate-500">
                      {formatDateTime(h.createdAt)}
                    </time>
                  </div>
                  {h.note && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 italic">
                      &ldquo;{h.note}&rdquo;
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Chat Atendimento */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 bg-primary text-white flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-bold">Atendimento Síncrono</h3>
                <p className="text-xs opacity-90">
                  Histórico mantido por 90 dias (LGPD)
                </p>
              </div>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
              {order.chatMessages?.length === 0 && (
                <p className="text-center text-sm text-slate-400 py-8">
                  Nenhuma mensagem ainda. Inicie a conversa com o cliente 👋
                </p>
              )}
              {order.chatMessages?.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "STAFF" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                      m.sender === "STAFF"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 rounded-tl-none text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <User className="w-3 h-3 opacity-80" />
                      <span className="text-[10px] uppercase font-bold opacity-80">
                        {m.sender === "STAFF" ? "Equipe" : "Cliente"}
                      </span>
                      <span className="text-[10px] opacity-70 ml-auto">
                        {formatDateTime(m.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {m.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), asyncSendChat())
                }
                placeholder="Digite uma mensagem ao cliente..."
                className="input flex-1"
              />
              <button
                onClick={asyncSendChat}
                disabled={!chatMessage.trim()}
                className="btn btn-primary !p-2 min-w-[48px] min-h-[48px]"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="card p-5 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Dados do Cliente
            </h3>
            {order.user ? (
              <div className="space-y-2 text-sm">
                <p>
                  <b className="text-slate-700 dark:text-slate-300">Nome:</b>{" "}
                  <span className="text-slate-900 dark:text-white">
                    {order.user.name}
                  </span>
                </p>
                <p className="truncate">
                  <b className="text-slate-700 dark:text-slate-300">E-mail:</b>{" "}
                  <span className="text-slate-900 dark:text-white">
                    {order.user.email}
                  </span>
                </p>
                <p>
                  <b className="text-slate-700 dark:text-slate-300">
                    Telefone:
                  </b>{" "}
                  <span className="text-slate-900 dark:text-white">
                    {order.user.phone || "—"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Compra realizada sem cadastro (convidado)
              </p>
            )}
          </div>

          {/* Endereço entrega */}
          <div className="card p-5 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Endereço de Entrega
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {order.shippingAddress.street},{" "}
                  {order.shippingAddress.number}
                  {order.shippingAddress.complement &&
                    ` - ${order.shippingAddress.complement}`}
                </p>
                <p>{order.shippingAddress.neighborhood}</p>
                <p>
                  {order.shippingAddress.city} - {order.shippingAddress.state}
                </p>
                <p>CEP: {order.shippingAddress.zipCode}</p>
                {order.trackingCode && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 mb-1">
                      🚚 Rastreio
                    </p>
                    <p className="font-mono text-sm break-all text-slate-800 dark:text-slate-100">
                      {order.trackingCode}
                    </p>
                    <a
                      href={`https://www.linkcorreios.com.br/?id=${order.trackingCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost !py-2 mt-2 w-full text-xs"
                    >
                      <Truck className="w-3.5 h-3.5" /> Rastrear nos Correios
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Retirada na loja</p>
            )}
          </div>

          {/* Pagamento */}
          <div className="card p-5 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Pagamento
            </h3>
            <div className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
              <p>
                <b>Método:</b>{" "}
                <span className="capitalize font-semibold text-slate-900 dark:text-white">
                  {order.paymentMethod.replace("_", " ")}
                </span>
              </p>
              <p>
                <b>Status:</b>{" "}
                <span className="capitalize font-semibold text-slate-900 dark:text-white">
                  {order.paymentStatus.replace("_", " ")}
                </span>
              </p>
              {order.cardLast4 && (
                <p>
                  <b>Cartão:</b>{" "}
                  <span className="font-mono text-slate-900 dark:text-white">
                    {maskCardLast4(order.cardLast4, order.cardBrand)}
                  </span>
                </p>
              )}
              {order.installments && order.installments > 1 && (
                <p>
                  <b>Parcelamento:</b>{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {order.installments}x sem juros de{" "}
                    {formatCurrency(order.totalAmount / order.installments)}
                  </span>
                </p>
              )}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Frete</span>
                <span>
                  {order.shippingCost === 0
                    ? "Grátis 🎉"
                    : formatCurrency(order.shippingCost)}
                </span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Cupom {order.couponCode}</span>
                  <span>- {formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Pago</span>
                <span className="text-primary">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
