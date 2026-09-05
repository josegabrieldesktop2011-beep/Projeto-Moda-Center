import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateOnly(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function maskCpf(v: string): string {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function maskPhone(v: string): string {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

export function maskCep(v: string): string {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}

export function maskCardNumber(v: string): string {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})\d+?$/, '$1');
}

export function maskCardLast4(v: string): string {
  const digits = v.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4.padStart(4, '*')}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MCSC-${y}${m}${d}-${random}`;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidCpf(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(numbers[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  d1 = d1 === 10 || d1 === 11 ? 0 : d1;
  if (parseInt(numbers[9]) !== d1) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(numbers[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  d2 = d2 === 10 || d2 === 11 ? 0 : d2;
  return parseInt(numbers[10]) === d2;
}

export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max - 3) + '...';
}

export function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
    PAGO: 'Pago',
    PROCESSANDO: 'Processando',
    ENVIADO: 'Enviado',
    ENTREGUE: 'Entregue',
    CANCELADO: 'Cancelado',
  };
  return map[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PAGO: 'bg-blue-100 text-blue-800 border-blue-200',
    PROCESSANDO: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    ENVIADO: 'bg-purple-100 text-purple-800 border-purple-200',
    ENTREGUE: 'bg-green-100 text-green-800 border-green-200',
    CANCELADO: 'bg-red-100 text-red-800 border-red-200',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentMethodLabel(method: string): string {
  const map: Record<string, string> = {
    CARTAO_CREDITO: 'Cartão de Crédito',
    PIX: 'Pix',
    BOLETO: 'Boleto Bancário',
  };
  return map[method] || method;
}
