'use client';

import * as React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

export default function AdminProdutos() {
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const { data, mutate } = useSWR(`/api/products?perPage=12&page=${page}${q ? `&q=${encodeURIComponent(q)}` : ''}`, fetcher, { refreshInterval: 0 });
  const products = data?.products || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const del = async (id: string) => {
    if (!confirm('Tem certeza que deseja inativar este produto?')) return;
    toast.success('Produto inativado (exemplo)');
    mutate();
  };

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <Package size={26} />
          Produtos
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary !py-2.5 !px-4 text-sm"
        >
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-xl">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input !min-h-[44px] !pl-10 !text-sm"
            placeholder="Buscar produtos..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input !min-h-[44px] text-sm max-w-xs cursor-pointer">
          <option>Todas as categorias</option>
          <option>Feminino</option>
          <option>Masculino</option>
          <option>Infantil</option>
          <option>Acessórios</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço</th>
                <th className="py-3 px-4">Estoque</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products.length ? products : Array.from({ length: 8 }).map((_, i) => ({
                id: 'mock-' + i,
                name: [
                  'Camiseta Básica Feminina',
                  'Calça Jeans Slim Masculina',
                  'Vestido Floral Midi',
                  'Jaqueta Couro Masculina',
                  'Blusa Tricô Feminina',
                  'Conjunto Infantil',
                  'Bolsa Transversal',
                  'Boné Baseball',
                ][i],
                image:
                  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=produto%20moda&image_size=square_hd',
                category: { name: ['Feminino', 'Masculino', 'Feminino', 'Masculino', 'Feminino', 'Infantil', 'Acessórios', 'Acessórios'][i] },
                finalPrice: [49.9, 99.9, 159.9, 249.9, 89.9, 79.9, 89.9, 39.9][i],
                totalStock: [50 + i * 3, 28, 18, Math.max(2, i), 40 - i, 35, 100 - i * 5, 130 - i * 10][i],
                isActive: i !== 7,
                featured: i <= 3,
              }))).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-[260px]">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 line-clamp-1">
                          {p.name}
                        </p>
                        {p.featured && (
                          <span className="chip bg-amber-50 text-amber-700 !py-0 mt-1">
                            <Sparkles size={10} /> Destaque
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {p.category?.name || '-'}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-gray-900">
                    {formatCurrency(p.finalPrice || p.price || 0)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-black ${
                        p.totalStock <= 5
                          ? 'text-red-600 flex items-center gap-1'
                          : p.totalStock <= 20
                          ? 'text-amber-600'
                          : 'text-green-600'
                      }`}
                    >
                      {p.totalStock <= 5 && <AlertTriangle size={12} />}
                      {p.totalStock ?? '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      className="flex items-center min-h-[36px]"
                      onClick={() => toast.success(p.isActive ? 'Produto desativado' : 'Produto ativado')}
                    >
                      {p.isActive ? (
                        <ToggleRight size={28} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center min-h-[40px] min-w-[40px]"
                        aria-label="Ver"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="w-9 h-9 rounded-lg hover:bg-primary-50 text-primary-600 flex items-center justify-center min-h-[40px] min-w-[40px]"
                        aria-label="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => del(p.id)}
                        className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center min-h-[40px] min-w-[40px]"
                        aria-label="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-100 gap-2 flex-wrap">
          <p className="text-sm text-gray-500">
            Mostrando {products.length || 8} de {data?.pagination?.total || '8'} produtos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary !py-2 !px-3 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages || 5) }).map((_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition min-h-[40px] ${
                    page === pg
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages || 5, p + 1))}
              disabled={page === (totalPages || 5)}
              className="btn-secondary !py-2 !px-3 text-sm disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowForm(false)}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl p-4 animate-slide-up max-h-[95vh]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <Package size={20} />
                  {editing ? 'Editar produto' : 'Novo produto'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center min-h-[44px] min-w-[44px]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
                <ProductForm editing={editing} />
              </div>
              <div className="flex items-center justify-end gap-3 p-5 sm:p-6 border-t border-gray-100 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success(
                      editing
                        ? 'Produto atualizado com sucesso!'
                        : 'Produto cadastrado com sucesso!'
                    );
                    mutate();
                    setShowForm(false);
                  }}
                  className="btn-primary"
                >
                  <Check size={16} />
                  {editing ? 'Salvar alterações' : 'Cadastrar produto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductForm({ editing }: { editing: any }) {
  const [form, setForm] = React.useState({
    name: editing?.name || '',
    slug: editing?.slug || '',
    category: editing?.category?.id || '',
    brand: editing?.brand || 'ModaCenter',
    price: editing?.price || '',
    discountPrice: editing?.discountPrice || '',
    composition: editing?.composition || '100% Algodão',
    care: editing?.care || '',
    description: editing?.description || '',
    featured: editing?.featured || false,
    isActive: editing?.isActive !== false,
  });
  const [variants, setVariants] = React.useState<any[]>(
    editing?.variants || [
      { size: 'P', color: 'Branco', colorHex: '#FFFFFF', stock: 10, priceExtra: 0 },
      { size: 'M', color: 'Branco', colorHex: '#FFFFFF', stock: 15, priceExtra: 0 },
      { size: 'G', color: 'Preto', colorHex: '#000000', stock: 8, priceExtra: 0 },
    ]
  );
  const [images, setImages] = React.useState<any[]>(
    editing?.images || [
      { url: null, placeholder: true },
      { url: null, placeholder: true },
      { url: null, placeholder: true },
    ]
  );

  const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
  const colors = [
    { name: 'Branco', hex: '#FFFFFF' },
    { name: 'Preto', hex: '#000000' },
    { name: 'Vermelho', hex: '#DC2626' },
    { name: 'Azul', hex: '#3B82F6' },
    { name: 'Verde', hex: '#16A34A' },
    { name: 'Amarelo', hex: '#EAB308' },
    { name: 'Rosa', hex: '#EC4899' },
    { name: 'Roxo', hex: '#9333EA' },
    { name: 'Bege', hex: '#FEF3C7' },
    { name: 'Cinza', hex: '#6B7280' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="label">Fotos do produto (até 6, max 200KB cada, WebP automático)</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {images.map((img, i) => (
            <label
              key={i}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition bg-gray-50 relative overflow-hidden group min-h-[96px]"
            >
              <Upload size={22} className="text-gray-400 group-hover:text-primary-500" />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary-600">
                Foto {i + 1}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Nome do produto</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Calça Jeans Slim Masculina"
          />
        </div>
        <div>
          <label className="label">Categoria</label>
          <select
            className="input cursor-pointer"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option>Feminino</option>
            <option>Masculino</option>
            <option>Infantil</option>
            <option>Acessórios</option>
          </select>
        </div>
        <div>
          <label className="label">Marca</label>
          <input
            className="input"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            className="input"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="129.90"
          />
        </div>
        <div>
          <label className="label">Preço promocional (R$)</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            className="input"
            value={form.discountPrice}
            onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
            placeholder="opcional"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Descrição</label>
          <textarea
            className="input !h-auto resize-none"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva o produto com detalhes..."
          />
        </div>
        <div>
          <label className="label">Composição</label>
          <input
            className="input"
            value={form.composition}
            onChange={(e) => setForm({ ...form, composition: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Cuidados</label>
          <input
            className="input"
            value={form.care}
            onChange={(e) => setForm({ ...form, care: e.target.value })}
            placeholder="Lavar à mão, não usar alvejante..."
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded text-primary-500"
            />
            <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              Produto em destaque
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-primary-500"
            />
            <span className="text-sm font-semibold text-gray-800">Ativo na loja</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label !mb-0">Variações (tamanho x cor x estoque)</label>
          <button
            type="button"
            onClick={() =>
              setVariants([
                ...variants,
                { size: 'M', color: 'Preto', colorHex: '#000000', stock: 10, priceExtra: 0 },
              ])
            }
            className="btn-outline-primary !py-1.5 !px-3 text-xs"
          >
            <Plus size={14} /> Adicionar variação
          </button>
        </div>
        <div className="card divide-y divide-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-wide hidden sm:grid">
            <div className="col-span-2">Tamanho</div>
            <div className="col-span-3">Cor</div>
            <div className="col-span-2">Estoque</div>
            <div className="col-span-3">SKU</div>
            <div className="col-span-2 text-right">Ação</div>
          </div>
          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-12 gap-2 p-3 items-center"
            >
              <div className="col-span-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase sm:hidden block mb-1">
                  Tamanho
                </span>
                <select
                  className="input !min-h-[40px] !py-2 !text-sm"
                  value={v.size}
                  onChange={(e) => {
                    const nv = [...variants];
                    nv[i] = { ...v, size: e.target.value };
                    setVariants(nv);
                  }}
                >
                  {sizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 sm:col-span-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase sm:hidden block mb-1">
                  Cor
                </span>
                <div className="flex items-center gap-2">
                  <select
                    className="input !min-h-[40px] !py-2 !text-sm flex-1"
                    value={v.color}
                    onChange={(e) => {
                      const match = colors.find((c) => c.name === e.target.value);
                      const nv = [...variants];
                      nv[i] = {
                        ...v,
                        color: e.target.value,
                        colorHex: match?.hex || '#CCC',
                      };
                      setVariants(nv);
                    }}
                  >
                    {colors.map((c) => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <span
                    className="w-8 h-8 rounded-lg border border-gray-200 shrink-0"
                    style={{ backgroundColor: v.colorHex }}
                  />
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase sm:hidden block mb-1">
                  Estoque
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input !min-h-[40px] !py-2 !text-sm"
                  value={v.stock}
                  onChange={(e) => {
                    const nv = [...variants];
                    nv[i] = { ...v, stock: parseInt(e.target.value) || 0 };
                    setVariants(nv);
                  }}
                />
              </div>
              <div className="col-span-1 sm:col-span-3 hidden sm:block">
                <span className="text-xs font-mono text-gray-500">
                  AUTO-{v.size}-{v.color.substring(0, 3).toUpperCase()}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                  className="btn-ghost !p-2 text-red-500 hover:bg-red-50 !min-h-[40px]"
                  aria-label="Remover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
