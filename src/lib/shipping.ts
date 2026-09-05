export async function fetchAddressFromCep(cep: string): Promise<{
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  error?: string;
}> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return { error: 'CEP inválido' };

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) throw new Error('Falha ao buscar CEP');
    const data = await res.json();
    if (data.erro) return { error: 'CEP não encontrado' };
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (e) {
    return { error: 'Erro ao consultar ViaCEP' };
  }
}

export async function calculateShipping(zipCode: string, totalWeightGrams: number = 500) {
  const clean = zipCode.replace(/\D/g, '');
  const firstDigit = parseInt(clean.charAt(0));
  let baseCost = 15.0;

  if (firstDigit <= 1) baseCost = 15.0;
  else if (firstDigit <= 3) baseCost = 18.0;
  else if (firstDigit <= 5) baseCost = 20.0;
  else if (firstDigit <= 7) baseCost = 22.0;
  else baseCost = 25.0;

  const weightFactor = Math.min(2, Math.max(1, totalWeightGrams / 500));
  const cost = baseCost * weightFactor;
  const days = 3 + Math.floor(Math.random() * 4);

  return [
    {
      name: 'Correios - PAC',
      cost: Number(cost.toFixed(2)),
      days: days + 2,
      type: 'pac',
    },
    {
      name: 'Correios - Sedex',
      cost: Number((cost * 1.6).toFixed(2)),
      days: days - 1 > 1 ? days - 1 : 2,
      type: 'sedex',
    },
    {
      name: 'Retirada na Loja',
      cost: 0,
      days: 0,
      type: 'retirada',
    },
  ];
}
