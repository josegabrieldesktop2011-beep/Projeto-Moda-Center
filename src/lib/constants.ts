export const Role = {
  CLIENTE: 'CLIENTE',
  VENDEDOR: 'VENDEDOR',
  ADMIN: 'ADMIN',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const OrderStatus = {
  AGUARDANDO_PAGAMENTO: 'AGUARDANDO_PAGAMENTO',
  PAGO: 'PAGO',
  PROCESSANDO: 'PROCESSANDO',
  ENVIADO: 'ENVIADO',
  ENTREGUE: 'ENTREGUE',
  CANCELADO: 'CANCELADO',
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const PaymentMethod = {
  CARTAO_CREDITO: 'CARTAO_CREDITO',
  PIX: 'PIX',
  BOLETO: 'BOLETO',
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDENTE: 'PENDENTE',
  APROVADO: 'APROVADO',
  RECUSADO: 'RECUSADO',
  ESTORNADO: 'ESTORNADO',
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];
