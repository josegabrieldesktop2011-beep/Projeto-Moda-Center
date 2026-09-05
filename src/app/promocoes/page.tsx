import { Suspense } from 'react';
import ProdutosPageClient from '@/app/produtos/page-client';

export default function PromocoesPage() {
  return (
    <Suspense fallback={<div className="container-pad py-10 text-center">Carregando ofertas...</div>}>
      <ProdutosPageClient />
    </Suspense>
  );
}
