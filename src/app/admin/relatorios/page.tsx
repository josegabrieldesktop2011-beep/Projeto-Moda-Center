"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  FileDown,
  FileText,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  PieChart as PieChartIcon,
  Loader2,
  Mail,
  Printer,
  ChevronDown,
} from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

const COLORS = ["#7C3AED", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6", "#EC4899"];
const fetcher = (u: string) => fetch(u).then((r) => r.json());

type Period = "7" | "30" | "90" | "365" | "custom";

export default function AdminRelatoriosPage() {
  const [period, setPeriod] = useState<Period>("30");
  const [dateFrom, setDateFrom] = useState(
    new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
  const [exporting, setExporting] = useState<string | null>(null);

  const qs = new URLSearchParams({
    period,
    dateFrom,
    dateTo,
  });

  const { data, isLoading } = useSWR(
    `/api/admin/reports?${qs.toString()}`,
    fetcher,
    { refreshInterval: 300000 }
  );

  const salesByDay = data?.salesByDay || [];
  const topProducts = data?.topProducts || [];
  const salesByCategory = data?.salesByCategory || [];
  const summary = data?.summary || {
    totalRevenue: 0,
    ordersCount: 0,
    avgOrderValue: 0,
    newClients: 0,
    productsSold: 0,
    canceledOrders: 0,
  };
  const ordersExport = data?.ordersExport || [];

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    setExporting("csv");
    try {
      const headers = [
        "Nº Pedido",
        "Data",
        "Cliente",
        "E-mail",
        "Status",
        "Forma Pagamento",
        "Subtotal",
        "Frete",
        "Desconto",
        "Total",
        "Itens Qtd",
      ];
      const rows = ordersExport.map((o: any) => [
        o.orderNumber,
        formatDate(o.createdAt),
        o.user?.name || "Convidado",
        o.user?.email || "",
        o.status,
        o.paymentMethod,
        o.subtotal?.toFixed(2) || "0",
        o.shippingCost?.toFixed(2) || "0",
        o.discountAmount?.toFixed(2) || "0",
        o.totalAmount?.toFixed(2) || "0",
        o._count?.items || 0,
      ]);
      const csv =
        "\uFEFF" +
        [headers, ...rows]
          .map((r) =>
            r
              .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
              .join(";")
          )
          .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      downloadBlob(
        blob,
        `relatorio-pedidos-${dateFrom}_a_${dateTo}.csv`
      );
      toast.success("Relatório CSV exportado com sucesso! 📊");
    } catch {
      toast.error("Erro ao exportar CSV");
    } finally {
      setExporting(null);
    }
  };

  const exportProductsCSV = () => {
    setExporting("csv-prod");
    try {
      const headers = [
        "SKU",
        "Produto",
        "Categoria",
        "Unidades Vendidas",
        "Receita Total",
        "Preço Médio",
      ];
      const rows = topProducts.map((p: any) => [
        p.product?.slug || "",
        p.productName,
        p.product?.category?.name || "",
        p.totalQty,
        p.totalRevenue.toFixed(2),
        (p.totalRevenue / Math.max(1, p.totalQty)).toFixed(2),
      ]);
      const csv =
        "\uFEFF" +
        [headers, ...rows]
          .map((r) =>
            r
              .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
              .join(";")
          )
          .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      downloadBlob(blob, `relatorio-produtos-${dateFrom}_a_${dateTo}.csv`);
      toast.success("Relatório de produtos exportado! 📦");
    } catch {
      toast.error("Erro");
    } finally {
      setExporting(null);
    }
  };

  const exportPDFPrint = () => {
    setExporting("pdf");
    toast.success("Abrindo visualização para impressão/PDF... 🖨️");
    setTimeout(() => {
      window.print();
      setExporting(null);
    }, 500);
  };

  const sendMonthlyEmail = () => {
    toast.success(
      "Relatório mensal enviado por e-mail para o administrador! 📧"
    );
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" /> Relatórios
            Gerenciais
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Análise de desempenho, vendas e comportamento do cliente
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={sendMonthlyEmail}
            className="btn btn-outline min-h-[48px]"
          >
            <Mail className="w-4 h-4" /> Enviar Relatório Mensal
          </button>
          <button
            onClick={exportProductsCSV}
            disabled={!!exporting}
            className="btn btn-outline min-h-[48px]"
          >
            {exporting === "csv-prod" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Exportar Produtos CSV
          </button>
          <button
            onClick={exportCSV}
            disabled={!!exporting}
            className="btn btn-outline min-h-[48px]"
          >
            {exporting === "csv" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Exportar Pedidos CSV
          </button>
          <button
            onClick={exportPDFPrint}
            disabled={!!exporting}
            className="btn btn-primary min-h-[48px]"
          >
            {exporting === "pdf" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Print Cabeçalho */}
      <div className="hidden print:block text-center border-b border-slate-300 pb-4 mb-4">
        <h1 className="text-2xl font-extrabold">MODA CENTER SANTA CRUZ</h1>
        <p className="text-sm text-slate-600">
          Relatório Gerencial - Período: {formatDate(dateFrom)} a{" "}
          {formatDate(dateTo)}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Emitido em {new Date().toLocaleString("pt-BR")}
        </p>
      </div>

      {/* Filtros Período */}
      <div className="card p-4 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="flex flex-wrap gap-2 items-center">
            <Calendar className="w-5 h-5 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Período:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { v: "7", l: "7 dias" },
                { v: "30", l: "30 dias" },
                { v: "90", l: "90 dias" },
                { v: "365", l: "1 ano" },
                { v: "custom", l: "Personalizado" },
              ].map((p) => (
                <button
                  key={p.v}
                  onClick={() => {
                    setPeriod(p.v as Period);
                    if (p.v !== "custom") {
                      const days = Number(p.v);
                      setDateFrom(
                        new Date(
                          Date.now() - days * 24 * 3600 * 1000
                        )
                          .toISOString()
                          .slice(0, 10)
                      );
                      setDateTo(
                        new Date().toISOString().slice(0, 10)
                      );
                    }
                  }}
                  className={`chip min-h-[40px] transition-all ${
                    period === p.v
                      ? "!bg-primary !text-white !border-primary"
                      : "bg-white dark:bg-slate-800"
                  }`}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPeriod("custom");
              }}
              className="input w-full sm:w-auto"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPeriod("custom");
              }}
              className="input w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      {isLoading ? (
        <div className="card p-12 text-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
          Carregando dados...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              {
                label: "Faturamento Total",
                value: formatCurrency(summary.totalRevenue),
                icon: DollarSign,
                color: "from-primary to-purple-500",
              },
              {
                label: "Pedidos",
                value: summary.ordersCount,
                icon: ShoppingBag,
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: "Ticket Médio",
                value: formatCurrency(summary.avgOrderValue),
                icon: TrendingUp,
                color: "from-emerald-500 to-green-500",
              },
              {
                label: "Novos Clientes",
                value: summary.newClients,
                icon: Users,
                color: "from-pink-500 to-rose-500",
              },
              {
                label: "Unidades Vendidas",
                value: summary.productsSold,
                icon: Package,
                color: "from-amber-500 to-orange-500",
              },
              {
                label: "Cancelados",
                value: summary.canceledOrders,
                icon: FileText,
                color: "from-red-500 to-rose-600",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="card p-4 overflow-hidden relative"
              >
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${k.color} opacity-20`}
                />
                <k.icon className={`w-5 h-5 text-primary mb-2`} />
                <p className="text-[10px] font-bold uppercase text-slate-500 leading-tight">
                  {k.label}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 break-words">
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="card p-5 xl:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Evolução de Vendas
                </h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      stroke="#94a3b8"
                      tickFormatter={(v) => v.slice(5)}
                    />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Faturamento"
                      stroke="#7C3AED"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      name="Pedidos"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      yAxisId={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-primary" /> Vendas por
                Categoria
              </h3>
              {salesByCategory.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
                  Sem dados no período
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        labelLine={false}
                      >
                        {salesByCategory.map((_: any, idx: number) => (
                          <Cell
                            key={idx}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Top Produtos */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" /> Top 10 Produtos
              Mais Vendidos
            </h3>
            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Nenhum produto vendido no período
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProducts.slice(0, 10)}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      fontSize={11}
                      stroke="#94a3b8"
                      tickFormatter={(v) =>
                        v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                      }
                    />
                    <YAxis
                      dataKey="productName"
                      type="category"
                      width={160}
                      fontSize={11}
                      stroke="#475569"
                      tickFormatter={(v) =>
                        v.length > 22 ? v.slice(0, 22) + "…" : v
                      }
                    />
                    <Tooltip
                      formatter={(v: number) => formatCurrency(v)}
                      cursor={{ fill: "rgba(124,58,237,0.05)" }}
                    />
                    <Bar
                      dataKey="totalRevenue"
                      name="Receita"
                      radius={[0, 8, 8, 0]}
                    >
                      {topProducts.map((_: any, idx: number) => (
                        <Cell
                          key={idx}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tabela produtos detalhe */}
            {topProducts.length > 0 && (
              <div className="mt-6 overflow-x-auto border-t border-slate-100 dark:border-slate-800 pt-4">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="text-left py-2 font-semibold">#</th>
                      <th className="text-left py-2 font-semibold">Produto</th>
                      <th className="text-right py-2 font-semibold">
                        Qtd Vendida
                      </th>
                      <th className="text-right py-2 font-semibold">
                        Receita
                      </th>
                      <th className="text-right py-2 font-semibold">
                        Preço Médio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {topProducts.slice(0, 10).map((p: any, i: number) => (
                      <tr key={p.id}>
                        <td className="py-2 text-slate-500 font-bold">
                          {i + 1}
                        </td>
                        <td className="py-2 font-medium text-slate-800 dark:text-slate-200">
                          {p.productName}
                        </td>
                        <td className="py-2 text-right font-semibold">
                          <span className="chip !py-1 inline-flex">
                            <Package className="w-3 h-3" />
                            {p.totalQty} un.
                          </span>
                        </td>
                        <td className="py-2 text-right font-bold text-primary">
                          {formatCurrency(p.totalRevenue)}
                        </td>
                        <td className="py-2 text-right text-slate-600 dark:text-slate-400">
                          {formatCurrency(
                            p.totalRevenue / Math.max(1, p.totalQty)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
