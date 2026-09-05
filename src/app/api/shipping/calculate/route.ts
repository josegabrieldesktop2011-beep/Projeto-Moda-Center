import { NextResponse } from 'next/server';
import { calculateShipping } from '@/lib/shipping';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cep = searchParams.get('cep');
    if (!cep) return NextResponse.json({ error: 'CEP obrigatório' }, { status: 400 });
    const options = await calculateShipping(cep);
    return NextResponse.json({ options });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao calcular' }, { status: 500 });
  }
}
