import { Suspense } from 'react';
import ProdutosPageClient from './page-client';

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="container-pad py-10 text-center">Carregando...</div>}>
      <ProdutosPageClient />
    </Suspense>
  );
}
