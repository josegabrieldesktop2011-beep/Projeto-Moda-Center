import Stripe from 'stripe';
import { randomBytes } from 'node:crypto';

function buildPlaceholderKey(length: number = 64): string {
  return randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
}

let key = process.env.STRIPE_SECRET_KEY || '';
if (
  !key ||
  key.includes('sua_chave') ||
  /^\W*$/.test(key) ||
  key.replace(/\W/g, '').length < 24
) {
  console.warn(
    '⚠️ STRIPE_SECRET_KEY ausente ou inválida. Usando chave placeholder para build. Pagamentos reais não funcionarão.'
  );
  key = buildPlaceholderKey(96);
}

export const stripe = new Stripe(key, {
  apiVersion: '2024-02-15',
  appInfo: {
    name: 'Moda Center Santa Cruz',
    version: '1.0.0',
  },
  telemetry: false,
  typescript: true,
});
