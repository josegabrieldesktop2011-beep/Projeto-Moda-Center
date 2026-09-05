import { NextResponse } from 'next/server';
import { fetchAddressFromCep } from '@/lib/shipping';

export async function GET(
  _req: Request,
  { params }: { params: { cep: string } }
) {
  const r = await fetchAddressFromCep(params.cep);
  if (r.error) return NextResponse.json(r, { status: 400 });
  return NextResponse.json(r);
}
