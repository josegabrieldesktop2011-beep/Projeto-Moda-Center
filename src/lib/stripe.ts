import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY || '';
if (!key) {
  console.warn(
    '⚠️ STRIPE_SECRET_KEY não configurada. Pagamento via Stripe não funcionará. Configure em .env.local'
  );
}

export const stripe = new Stripe(key, {
  apiVersion: '2024-02-15',
  appInfo: {
    name: 'Moda Center Santa Cruz',
    version: '1.0.0',
  },
});
