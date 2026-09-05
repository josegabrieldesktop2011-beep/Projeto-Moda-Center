import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const senha = await bcrypt.hash('Senha@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@modacenter.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@modacenter.com.br',
      passwordHash: senha,
      role: 'ADMIN',
      emailVerified: new Date(),
      notificationPrefs: { create: {} },
    },
  });

  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@modacenter.com.br' },
    update: {},
    create: {
      name: 'Vendedor',
      email: 'vendedor@modacenter.com.br',
      passwordHash: senha,
      role: 'VENDEDOR',
      emailVerified: new Date(),
      notificationPrefs: { create: {} },
    },
  });

  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@modacenter.com.br' },
    update: {},
    create: {
      name: 'Cliente Teste',
      email: 'cliente@modacenter.com.br',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      passwordHash: senha,
      role: 'CLIENTE',
      emailVerified: new Date(),
      addresses: {
        create: {
          recipient: 'Cliente Teste',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Santa Cruz do Sul',
          state: 'RS',
          zipCode: '96810-000',
          isDefault: true,
        },
      },
      notificationPrefs: { create: {} },
    },
  });

  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'feminino' },
      update: {},
      create: { name: 'Feminino', slug: 'feminino', description: 'Moda Feminina' },
    }),
    prisma.category.upsert({
      where: { slug: 'masculino' },
      update: {},
      create: { name: 'Masculino', slug: 'masculino', description: 'Moda Masculina' },
    }),
    prisma.category.upsert({
      where: { slug: 'infantil' },
      update: {},
      create: { name: 'Infantil', slug: 'infantil', description: 'Moda Infantil' },
    }),
    prisma.category.upsert({
      where: { slug: 'acessorios' },
      update: {},
      create: { name: 'Acessórios', slug: 'acessorios', description: 'Acessórios' },
    }),
  ]);

  const produtosData = [
    {
      name: 'Camiseta Básica Feminina',
      slug: 'camiseta-basica-feminina',
      description: 'Camiseta de algodão premium, confortável para o dia a dia.',
      composition: '100% Algodão',
      price: 49.90,
      brand: 'ModaCenter',
      categoryId: categorias[0].id,
      featured: true,
      colors: [
        { color: 'Branco', hex: '#FFFFFF', sizes: ['P', 'M', 'G', 'GG'], stock: 50 },
        { color: 'Preto', hex: '#000000', sizes: ['P', 'M', 'G'], stock: 40 },
        { color: 'Rosa', hex: '#F9A8D4', sizes: ['M', 'G', 'GG'], stock: 30 },
      ],
    },
    {
      name: 'Calça Jeans Masculina Slim',
      slug: 'calca-jeans-masculina-slim',
      description: 'Calça jeans modelagem slim com lavagem escura.',
      composition: '98% Algodão, 2% Elastano',
      price: 129.90,
      discountPrice: 99.90,
      brand: 'ModaCenter',
      categoryId: categorias[1].id,
      featured: true,
      colors: [
        { color: 'Escuro', hex: '#1E293B', sizes: ['38', '40', '42', '44', '46'], stock: 45 },
        { color: 'Médio', hex: '#3F4F64', sizes: ['40', '42', '44'], stock: 25 },
      ],
    },
    {
      name: 'Vestido Floral Midi',
      slug: 'vestido-floral-midi',
      description: 'Vestido midi com estampa floral, tecido fluido.',
      composition: '100% Poliéster',
      price: 159.90,
      brand: 'ModaCenter',
      categoryId: categorias[0].id,
      featured: true,
      colors: [
        { color: 'Rosa', hex: '#FDA4AF', sizes: ['P', 'M', 'G'], stock: 20 },
      ],
    },
    {
      name: 'Conjunto Infantil Unissex',
      slug: 'conjunto-infantil-unissex',
      description: 'Conjunto camiseta + bermuda infantil.',
      composition: '100% Algodão',
      price: 79.90,
      brand: 'ModaCenter',
      categoryId: categorias[2].id,
      colors: [
        { color: 'Azul', hex: '#3B82F6', sizes: ['2', '4', '6', '8', '10'], stock: 35 },
      ],
    },
    {
      name: 'Bolsa Transversal Couro',
      slug: 'bolsa-transversal-couro',
      description: 'Bolsa transversal em couro sintético, vários compartimentos.',
      composition: 'Couro Sintético',
      price: 89.90,
      brand: 'ModaCenter',
      categoryId: categorias[3].id,
      colors: [
        { color: 'Preto', hex: '#000000', sizes: ['UN'], stock: 60 },
        { color: 'Café', hex: '#78350F', sizes: ['UN'], stock: 40 },
      ],
    },
    {
      name: 'Jaqueta de Couro Masculina',
      slug: 'jaqueta-couro-masculina',
      description: 'Jaqueta biker em couro sintético premium.',
      composition: 'Couro Sintético + Poliéster',
      price: 299.90,
      discountPrice: 249.90,
      brand: 'ModaCenter',
      categoryId: categorias[1].id,
      featured: true,
      colors: [
        { color: 'Preto', hex: '#000000', sizes: ['M', 'G', 'GG'], stock: 15 },
      ],
    },
    {
      name: 'Blusa de Tricô Feminina',
      slug: 'blusa-trico-feminina',
      description: 'Blusa de tricô gola alta, quentinha e elegante.',
      composition: '100% Acrílico',
      price: 89.90,
      brand: 'ModaCenter',
      categoryId: categorias[0].id,
      colors: [
        { color: 'Bege', hex: '#FEF3C7', sizes: ['P', 'M', 'G'], stock: 28 },
        { color: 'Bordô', hex: '#7F1D1D', sizes: ['M', 'G'], stock: 12 },
      ],
    },
    {
      name: 'Boné Baseball Unissex',
      slug: 'bone-baseball-unissex',
      description: 'Boné modelo baseball com logo bordado.',
      composition: 'Algodão',
      price: 39.90,
      brand: 'ModaCenter',
      categoryId: categorias[3].id,
      colors: [
        { color: 'Preto', hex: '#000000', sizes: ['UN'], stock: 100 },
        { color: 'Branco', hex: '#FFFFFF', sizes: ['UN'], stock: 80 },
        { color: 'Vermelho', hex: '#DC2626', sizes: ['UN'], stock: 50 },
      ],
    },
  ];

  const imgPlaceholder = (seed: string) =>
    `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
      `produto de moda ${seed} fundo branco foto profissional ecommerce alta qualidade`
    )}&image_size=square_hd`;

  for (let i = 0; i < produtosData.length; i++) {
    const p = produtosData[i];
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        composition: p.composition,
        price: p.price,
        discountPrice: p.discountPrice,
        brand: p.brand,
        categoryId: p.categoryId,
        featured: p.featured,
        images: {
          createMany: {
            data: [
              { url: imgPlaceholder(p.slug + '-1'), position: 0, alt: p.name + ' vista 1' },
              { url: imgPlaceholder(p.slug + '-2'), position: 1, alt: p.name + ' vista 2' },
              { url: imgPlaceholder(p.slug + '-3'), position: 2, alt: p.name + ' vista detalhe' },
            ],
          },
        },
        variants: {
          createMany: {
            data: p.colors.flatMap((c) =>
              c.sizes.map((s) => ({
                size: s,
                color: c.color,
                colorHex: c.hex,
                stock: c.stock,
                sku: `${p.slug.substring(0, 8)}-${c.color.substring(0, 3)}-${s}`.toUpperCase(),
              }))
            ),
          },
        },
      },
    });
    console.log(`✅ Produto criado: ${product.name}`);
  }

  await prisma.coupon.upsert({
    where: { code: 'BEMVINDO10' },
    update: {},
    create: {
      code: 'BEMVINDO10',
      description: 'Cupom de boas-vindas com 10% de desconto',
      discountType: 'percentual',
      discountValue: 10,
      minOrderValue: 100,
      maxUses: 1000,
      usesPerClient: 1,
      validFrom: new Date(),
    },
  });

  console.log('✅ Seed concluído!');
  console.log('👤 Admin: admin@modacenter.com.br / Senha@123');
  console.log('👤 Vendedor: vendedor@modacenter.com.br / Senha@123');
  console.log('👤 Cliente: cliente@modacenter.com.br / Senha@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
