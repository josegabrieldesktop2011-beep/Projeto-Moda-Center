
  <p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://via.placeholder.com/80x80/7c3aed/ffffff?text=MC">
    <img src="https://via.placeholder.com/160x160/7c3aed/ffffff?text=MODA+CENTER" alt="Moda Center Santa Cruz" width="180">
  </picture>
</p>

<h1 align="center">Moda Center Santa Cruz 🛍️💜</h1>

<p align="center">
  <strong>E-commerce de moda popular — Mobile First, 100% PT-BR, com painel administrativo completo</strong>
</p>

<p align="center">
  <a href="#-stack-tecnológica"><b>Stack</b></a> •
  <a href="#-instalação-passo-a-passo"><b>Instalação</b></a> •
  <a href="#-contas-demo"><b>Contas Demo</b></a> •
  <a href="#-funcionalidades"><b>Funcionalidades</b></a> •
  <a href="#-integrações"><b>Integrações</b></a> •
  <a href="#-estrutura-de-pastas"><b>Estrutura</b></a>
</p>

<p align="center">
  <img alt="Next.js 14" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white&style=for-the-badge">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-^5-3178C6?logo=typescript&logoColor=white&style=for-the-badge">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-^3-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma%20ORM-^5-2D3748?logo=prisma&logoColor=white&style=for-the-badge">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white&style=for-the-badge">
  <img alt="Stripe" src="https://img.shields.io/badge/Pagamento-Stripe-635BFF?logo=stripe&logoColor=white&style=for-the-badge">
  <img alt="Status" src="https://img.shields.io/badge/status-Produção%20Ready-10B981?style=for-the-badge">
</p>

---

## ✨ Visão Geral

**Moda Center Santa Cruz** é um e-commerce completo de roupas, construído com a estratégia **Mobile-First** em mente (celular como dispositivo principal, desktop como secundário). A solução implementa perfis segregados para **Clientes** e **Administradores/Vendedores** com painéis independentes, seguindo as melhores práticas de usabilidade, segurança e desempenho.

O design é totalmente responsivo, com **alvos de toque ≥ 48×48px** conforme especificado, garantindo uma experiência otimizada em telas de 360px atá 4K+.

> 💡 *"Moda que veste a sua história"*

---

## 🛠️ Stack Tecnológica

| **Categoria**          | **Ferramenta / Biblioteca**                                  | **Versão** |
|-------------------------|---------------------------------------------------------------|------------|
| Framework Front-End     | Next.js (App Router + Server & Client Components)             | `14.x`     |
| Linguagem               | TypeScript (strict mode, paths `@/*`)                         | `^5`       |
| Estilização             | Tailwind CSS + tema customizado (cor primária #7C3AED roxo)   | `^3.4`     |
| ORM / Banco de Dados    | Prisma ORM + PostgreSQL (18 entidades relacionais)            | `^5.22`    |
| Autenticação            | NextAuth v4 + bcryptjs (12 rounds) + JWT roles                | `^4.24`    |
| Gerenciamento Estado    | Zustand (stores persistidas) + SWR (data fetching c/ refresh) | `^4.5`     |
| UI / UX                 | lucide-react (ícones), sonner (toasts), next-themes           | *          |
| Formulários             | React Hook Form + Zod (validação tipada)                      | *          |
| Gráficos Admin          | Recharts (Line, Bar, Pie charts)                              | `^2.12`    |
| Upload / Imagens        | React Dropzone + Sharp (compressão WebP, até 200KB)           | *          |
| Pagamento (PCI)         | Stripe API v2024-02-15 + webhooks + fallback mock             | `^16.0`    |
| E-mails                 | Resend (transacionais) + templates (mockados no sistema)      | -          |
| CEP / Frete             | ViaCEP + simulação de frete por faixa de CEP                  | -          |
| Qualidade               | ESLint, Prettier-ready, comentários em PT-BR                  | -          |

---

## 🚀 Instalação Passo a Passo

Siga estes 6 passos para ter o **Moda Center SC** rodando no seu computador em alguns minutos!

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito          | Versão mínima recomendada | Instalação                                  |
|--------------------|---------------------------|---------------------------------------------|
| 🟢 **Node.js**     | `18.17` ou **20+** LTS    | [nodejs.org](https://nodejs.org/pt-br)      |
| 🟢 **npm / pnpm**  | `npm 9+`                  | Vem com Node.js — rode `npm i -g npm@latest` |
| 🟢 **PostgreSQL**  | `14+` (16 recomendado)    | Windows: [Postgres.org](https://postgresapp.com/downloads.html) — Docker: `docker run --name pg-mc -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres` |

---

### Passo 1 — Clonar / Baixar o projeto

```bash
# Acesse a pasta do projeto (caso baixou manualmente, só acesse-a):
cd "c:\Users\GABRIEL\Documents\Projeto-Moda-Center"

# Ou clone via git (se versionado):
# git clone https://github.com/usuario/moda-center-santa-cruz.git
# cd moda-center-santa-cruz
```

---

### Passo 2 — Instalar as dependências

Abra o terminal na pasta do projeto e rode:

```bash
npm install

# Ou com pnpm (mais rápido, recomendado):
# pnpm install
```

> ⏱️ Esse passo pode levar entre 30 segundos a 2 minutos dependendo da conexão. Ao final, você verá uma pasta `node_modules` criada no diretório raiz.

---

### Passo 3 — Configurar variáveis de ambiente (`.env.local`)

Na raiz do projeto, existe um arquivo **`.env.example`** com a estrutura padrão. Copie ele e renomeie para **`.env.local`**:

#### 🪟 Windows (PowerShell / CMD):
```powershell
copy .env.example .env.local
```

#### 🐧 macOS / Linux (bash / zsh):
```bash
cp .env.example .env.local
```

Agora **abra o arquivo `.env.local`** em qualquer editor (VS Code, Notepad++) e configure conforme abaixo:

```dotenv
# ============================================================
#  1. BANCO DE DADOS (PostgreSQL)
# ============================================================
# Altere usuário, senha, porta e banco conforme sua instalação.
# Docker padrão: postgres / postgres / localhost:5432
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moda_center_sc?schema=public"

# ============================================================
#  2. AUTENTICAÇÃO NextAuth (3 variáveis obrigatórias)
# ============================================================
# URL pública do seu site. Em dev é sempre http://localhost:3000
NEXTAUTH_URL="http://localhost:3000"

# 👉 GERAR UM SECRET FORTÍSSIMO (não deixe o padrão abaixo em produção!):
# Rode no terminal: openssl rand -base64 32
NEXTAUTH_SECRET="troque_aqui_por_uma_chave_segura_de_32_caracteres_minimo_xyz123"

# ============================================================
#  3. PAGAMENTO STRIPE  (PCI DSS Nível 1)
# ============================================================
# ✨ Para testar sem chave real: basta DEIXAR VAZIOS que o sistema
#   automaticamente usa MOCK de pagamento (perfeito para dev).
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# ============================================================
#  4. E-MAILS TRANSACIONAIS (Resend)
# ============================================================
# ✨ Se não configurado: logs de e-mails aparecem no console do node.
RESEND_API_KEY=""

# ============================================================
#  5. INTEGRAÇÕES OPCIONAIS
# ============================================================
# VIA CEP (não precisa de chave — API pública)
VIA_CEP_BASE_URL="https://viacep.com.br/ws"

# Firebase Cloud Messaging (Push notifications — opcional)
NEXT_PUBLIC_FCM_VAPID_KEY=""
FCM_SERVER_KEY=""
```

> 💡 **Quer testar sem configurar NADA?** Basta deixar `STRIPE_*` e `RESEND_API_KEY` VAZIOS que o projeto já roda com mocks internos! A única variável realmente obrigatória para rodar local é a `DATABASE_URL` e o PostgreSQL rodando.

---

### Passo 4 — Rodar as migrations (criar tabelas no banco)

Vamos criar todas as 18 tabelas do banco de dados automaticamente usando o schema Prisma:

```bash
npx prisma migrate dev --name init
```

O que isso faz?
1. 🔍 Lê o arquivo `prisma/schema.prisma` (18 entidades: User, Product, Order, Coupon...)
2. 📜 Cria migration SQL automaticamente
3. 💾 Executa as queries no PostgreSQL

> 🟢 **Sucesso esperado**: "Migration `init` applied successfully." e nenhum erro.

---

### Passo 5 — Popular o banco com dados de DEMO (Seed)

O projeto vem com um **seed completo** para você testar tudo sem precisar cadastrar nada manualmente. Roda esse comando:

```bash
npx prisma db seed
```

O seed cria automaticamente:
| **Item**                     | **Qtd** |
|-------------------------------|---------|
| 👥 Usuários demo              | 3 (admin, vendedor, cliente) |
| 👗 Categorias                 | 4 (Masculino / Feminino / Infantil / Acessórios) |
| 👕 Produtos + fotos          | 8 produtos de roupas reais |
| 🔀 Variações (tam × cor)     | +50 variações com estoque |
| 🎟️ Cupom promocional         | 1 cupom `BEMVINDO10` (10% OFF) |

---

### Passo 6 — Rodar o projeto em desenvolvimento

Finalmente! 🔥 Rode o servidor local:

```bash
npm run dev
```

Depois de alguns segundos, abra no seu navegador:

<h3 align="center">
👉 <a href="http://localhost:3000"><b>http://localhost:3000</b></a>
</h3>

🎉 **Pronto!** O **Moda Center SC** está no ar!

---

## 🔑 Contas DEMO

O seed cria **3 contas de exemplo** (todas com a mesma senha — fácil de lembrar!). Use elas para testar cada perfil:

| Perfil                | **E-mail**                  | Senha         | Acesso à rota         |
|------------------------|------------------------------|---------------|------------------------|
| 👑 **Administrador**   | `admin@modacenter.com.br`   | `Senha@123`   | `/admin` (tudo)        |
| 👔 **Vendedor**        | `vendedor@modacenter.com.br`| `Senha@123`   | `/admin` (restrito)    |
| 👕 **Cliente**         | `cliente@modacenter.com.br` | `Senha@123`   | `/minha-conta`         |

> 💡 **Dica pro**: Na tela de login tem **atalhos clicáveis** ("Entrar como Cliente / Vendedor / Admin") — é só clicar que já preenche tudo, sem digitar nada!

---

## 🎯 Funcionalidades Implementadas

### 👤 Para Clientes (Perfil CLIENTE)
✅ Página inicial com carrossel hero, categorias em grid e produtos em destaque<br>
✅ Busca global com autocomplete + filtros avançados (tamanho, cor, marca, faixa de preço, ordenação)<br>
✅ Persistência de filtros na sessão (não perde ao navegar)<br>
✅ Página detalhe do produto: galeria de fotos com **zoom 2x+**, tabela medidas padronizada<br>
✅ Avaliações verificadas (**apenas quem comprou e recebeu pode avaliar** — sem edição depois)<br>
✅ Botões proeminentes "Adicionar ao Carrinho" e "Lista de Desejos" com feedback visual imediato<br>
✅ Carrinho completo: alterar quantidade, remover, salvar para depois, cálculo de frete por CEP<br>
✅ Cupons de desconto com validação automática (percentual / fixo, validade, min pedido, usos)<br>
✅ ✨ **Checkout em 3 etapas** (mobile-first, 1-Endereço+Frete / 2-Pagamento / 3-Revisão)<br>
✅ Autocomplete de endereço via **API ViaCEP** (colocou CEP = preenche tudo)<br>
✅ 3 métodos de pagamento: **Cartão de crédito (12x s/ juros)**, **PIX** e **Boleto Bancário**<br>
✅ Área logada (Minha Conta) com dashboard, histórico de pedidos, timeline de status<br>
✅ Gerenciamento de **até 5 endereços** + **até 3 cartões** (apenas 4 últimos dígitos visíveis — PCI DSS)<br>
✅ Notificações push (estrutura FCM) + preferências por canal (e-mail, push, WhatsApp)<br>
✅ Sistema de avaliação pós-entrega (estrelas 1–5 + comentário até 500 chars)<br>
✅ **Chat síncrono integrado** em cada pedido com o vendedor<br>
✅ Solicitação de exclusão de dados LGPD com prazo de 15 dias corridos

### 📊 Para Administradores / Vendedores (Perfil ADMIN / VENDEDOR)
✅ 📈 **Dashboard em tempo real** (atualiza a cada 5 min) com KPIs e gráficos Recharts interativos:<br>
  &nbsp;&nbsp;&nbsp;• Faturamento (filtros diário/semanal/mensal) — gráfico de linha<br>
  &nbsp;&nbsp;&nbsp;• Quantidade de pedidos (pendentes, concluídos, cancelados)<br>
  &nbsp;&nbsp;&nbsp;• **Top 5 produtos mais vendidos** (gráfico de barras)<br>
  &nbsp;&nbsp;&nbsp;• Distribuição por categoria (gráfico de pizza)<br>
  &nbsp;&nbsp;&nbsp;• **Alertas de estoque baixo (≤5 unidades)** destacados em vermelho<br>
  &nbsp;&nbsp;&nbsp;• Ticket médio, novos clientes<br>
✅ 🛍️ **Gestão de produtos** (CRUD completo):
  - Upload de **até 6 fotos por produto** (drag & drop UI)
  - **Compressão automática + formato WebP** (Sharp)
  - Preços, categoria, descrição longa, composição, cuidados
  - **Variações ilimitadas** (tamanho × cor × estoque individual)
  - Toggle "Destaque", "Ativo", badges de estoque baixo

✅ 📦 **Gestão de pedidos** (filtros por status, data, cliente, busca por nº pedido):
  - **Atualização de 6 status** com disparo de notificação e-mail+push simulado
  - Timeline visual dos 5 passos (Aguardando Pag. → Pago → Processando → Enviado → Entregue)
  - **Código de rastreio + link direto oficial dos Correios**
  - **Emissão NF-e simulada (integração SEFAZ pronta)**
  - **Chat direto integrado cliente ↔ vendedor** (histórico 90 dias LGPD)

✅ 🎟️ **Gestão de cupons** (CRUD com TODAS regras):
  - Percentual ou valor fixo de desconto
  - Valor mínimo de pedido
  - Validade (data inicial / final)
  - Limite de usos TOTAL + por cliente
  - Modal auditoria: ver **todos os usos do cupom** (quem usou, que pedido, data)
  - Ativação/desativação 1 clique
  - Barra de progresso visual de "uso do cupom"

✅ 👥 **Gestão de clientes**: lista completa com tier VIP (Ouro/Prata/Bronze), total gasto, nº pedidos e avaliações, busca por nome/email/telefone, ordenação por gasto/recente/pedidos

✅ 📊 **Relatórios gerenciais completos** com exportação 1 clique:
  - Export CSV (Excel) de pedidos com UTF-8 BOM (acentos funcionam!)
  - Export CSV de desempenho de produtos
  - Export PDF via nativo "Imprimir do navegador" (template profissional já formatado)
  - **Envio de relatório mensal por e-mail ao admin (5º dia útil)**
  - 6 KPIs, gráfico linha (faturamento × pedidos), gráfico pizza (categoria), gráfico barras horizontal top 10 produtos

✅ ⚙️ **Configurações da loja** (6 abas):
  - Dados da empresa (CNPJ, IE, endereço, horários, WhatsApp)
  - Envio/Frete (mínimo para frete grátis, transportadora, prazos PAC/SEDEX, retirada loja)
  - Pagamento (parcelamento máximo, desconto PIX/boleto, max 12x sem juros)
  - E-mail transacional (SMTP/Resend, e-mails notificação)
  - Segurança/LGPD (2FA obrigatório para equipe, retenção logs 90 dias, força de senha)
  - Sistema (backup diário, cópia nuvem criptografada, teste restauração)

### 🔐 Segurança & Conformidade
✅ **bcryptjs 12 rounds** para hash de senhas (irreversível)<br>
✅ Roles segregados CLIENTE / VENDEDOR / ADMIN em sessão JWT NextAuth<br>
✅ Guard de rotas admin (não-staff redirecionado)<br>
✅ Máscara PCI em cartões (4 últimos dígitos + bandeira apenas)<br>
✅ LGPD 100%: página de Privacidade, Termos, formulário público de exclusão de dados<br>
✅ Retenção de logs/auditoria 90 dias (tabela `AuditLog`)<br>
✅ Pedidos criados com **atomicidade transacional** (Prisma `$transaction` = ou tudo grava, ou nada)<br>
✅ Validação de estoque antes de finalizar pedido (bloqueia compra sem estoque)<br>
✅ Mensagens de erro amigáveis + tratamento global com toasts Sonner<br>

---

## 🔗 Integrações Implementadas

| Integração           | Status      | O que faz?                                                            |
|----------------------|-------------|-----------------------------------------------------------------------|
| **ViaCEP**           | ✅ Real      | Busca endereço por CEP (cache 24h Next) — checkout + endereços cliente |
| **Stripe Payments**  | ✅ Real/Mock | Gateway PCI certificado. Sem chave → fallback mock (sem precisar cadastrar nada!) |
| **Stripe Webhooks**  | ✅ Estruturado | Atualiza estoque real, dispara notificação de transação negada (5min) |
| **Correios (Frete)** | 🟡 Mock      | Simulação por faixa de CEP. Facilmente plugável aos Correios/SigepWeb |
| **Resend E-mail**    | ✅ Real/Mock | Envio de e-mails transacionais. Sem chave → loga no console do node  |
| **SEFAZ (NF-e)**     | 🟡 Estrutura | Interface emissão pronta, só precisa adicionar XML da sua NF-e       |
| **Firebase FCM**     | 🟡 Estrutura | Páginas preferências e tokens prontos, precisa credenciais no .env  |
| **Facebook / GTM**   | ✅ Estrutura | Páginas com `metadata` OpenGraph/SEO configurados no App Router      |
| **CDN Cache**        | ✅ Ready     | `next.config.js` já tem `remotePatterns` + `react strict`             |

---

## 📁 Estrutura de Pastas (Principais Arquivos)

```
Moda-Center/
├── prisma/
│   ├── schema.prisma       ← 18 models (banco relacional completo)
│   └── seed.ts             ← Dados demo de clientes/produtos/cupons
├── public/                 ← Imagens estáticas, favicon, opengraph
├── src/
│   ├── app/
│   │   ├── (rotas públicas do cliente)
│   │   │   ├── page.tsx                      ← Home (hero, categorias, destaques)
│   │   │   ├── produtos/page.tsx             ← Listagem + filtros
│   │   │   ├── produto/[slug]/page.tsx       ← Detalhe produto (zoom, avaliações)
│   │   │   ├── promocoes/page.tsx            ← Página promoções
│   │   │   ├── carrinho/page.tsx             ← Carrinho completo + cupom
│   │   │   ├── checkout/page.tsx             ← Checkout em 3 etapas
│   │   │   ├── pedido/[n]/sucesso/page.tsx   ← Sucesso (PIX QR, boleto)
│   │   │   ├── lista-desejos/page.tsx        ← Wishlist
│   │   │   ├── sobre, contato, trocas, entregas, privacidade, termos, exclusao-dados  ← Institucionais / LGPD
│   │   │   └── auth/login, auth/cadastro, auth/esqueci-senha   ← Autenticação
│   │   ├── minha-conta/                      ← Área logada do cliente
│   │   │   ├── layout.tsx (sidebar navegação + drawer mobile)
│   │   │   ├── page.tsx (Dashboard cliente: KPIs, últimos pedidos)
│   │   │   ├── pedidos/page.tsx + [n]/page.tsx (detalhe + timeline + chat + avaliar)
│   │   │   ├── enderecos/page.tsx (CRUD 5 endereços)
│   │   │   ├── cartoes/page.tsx   (até 3 cartões, PCI 4 últimos)
│   │   │   ├── notificacoes/page.tsx (central + preferências)
│   │   │   └── configuracoes/page.tsx (perfil, senha, 2FA, LGPD)
│   │   └── admin/                             ← Painel vendedor/administrativo
│   │       ├── layout.tsx (guarda de rota + sidebar + menu mobile)
│   │       ├── page.tsx (Dashboard KPIs + Recharts + estoque baixo)
│   │       ├── produtos/page.tsx (CRUD + upload 6 fotos WebP + variações)
│   │       ├── pedidos/page.tsx + [n]/page.tsx (filtros + status + NF-e + chat)
│   │       ├── cupons/page.tsx (CRUD regras + auditoria usos)
│   │       ├── clientes/page.tsx (lista + tier VIP + gasto total)
│   │       ├── relatorios/page.tsx (KPIs + gráficos + export CSV/PDF)
│   │       └── configuracoes/page.tsx (loja/envio/pagamento/email/segurança)
│   ├── components/
│   │   ├── layout/  ← SiteHeader (hambúrguer, busca, carrinho badge, perfil), SiteFooter (4 col + LGPD)
│   │   ├── products/ProductCard
│   │   └── ui/      ← StarsRating, HeroCarousel
│   └── lib/
│       ├── prisma.ts    ← Singleton PrismaClient
│       ├── auth.ts      ← NextAuth options + Roles + guards
│       ├── store.ts     ← Zustand (carrinho, filtros persist)
│       ├── stripe.ts    ← Instância Stripe
│       ├── shipping.ts  ← ViaCEP + cálculo frete
│       ├── utils.ts     ← formatações (moeda, data, CPF, CEP, cartão, bcrypt 12r...)
│       └── ...
├── .env.example        ← TEMPLATE .env (copiar para .env.local)
├── package.json        ← Dependências e scripts
├── next.config.js      ← Next 14 config, remote patterns
├── tailwind.config.js  ← Tema roxo/primary + breakpoints mobile-first
├── tsconfig.json       ← Paths @/*
└── postcss.config.js
```

---

## 🏗️ Scripts Disponíveis (package.json)

Rode no terminal:

```bash
npm run dev       # 🔥 Ambiente desenvolvimento (http://localhost:3000)
npm run build     # 📦 Build OTIMIZADO de produção (minify, compressão)
npm start         # 🚀 SERVER da build production
npm run lint      # 🔍 Lint do Next (ESLint)
npm run format    # ✨ Formata arquivos (Prettier)
prisma studio     # 🎲 GUI visual do banco (http://localhost:5555)
prisma migrate dev --name nome_da_migracao
prisma db seed    # 🌱 Popular banco com dados demo
prisma db push    # ⚡ Aplicar alterações schema diretamente (sem migration)
```

---

## 🛡️ Boas Práticas de Segurança (já aplicadas)

| Vulnerabilidade       | Implementação de mitigação                                                              |
|-----------------------|-----------------------------------------------------------------------------------------|
| 🔴 SQL Injection       | Prisma ORM + queries parametrizadas — concatenação zero SQL bruto                       |
| 🔴 XSS (Cross Site)    | React autoescapa outputs por padrão + `dangerouslySetInnerHTML` NÃO usado em lugar nenhum |
| 🔴 CSRF                | NextAuth + HttpOnly cookies + tokens server-side                                         |
| 🔴 Brute force login   | Estrutura pronta em configurações: bloqueio após N tentativas + delay + 2FA Obrigatório staff |
| 🔴 Senhas fracas       | bcryptjs 12 rounds + validação frontend 8 caracteres, nº e símbolo                        |
| 🔴 PCI DSS Cartão      | NÚMERO COMPLETO NUNCA passa pelo nosso server — direto pro Stripe via Elements; só 4 últimos dígitos salvos |
| 🔴 LGPD                | Páginas de Privacidade, Termos, Formulário público de exclusão (15 dias corridos) + DPO |

---

## 🎨 Padrões de Design do Projeto

- **Estratégia**: **MOBILE-FIRST** — breakpoint base é o celular (360px a 480px), depois `sm/md/lg/xl` para telas maiores.
- **Cor principal**: Roxo **`#7C3AED` (primary)** + dourado `#F59E0B (gold)` para detalhes de destaque.
- **Fonte**: Inter (sans-serif moderna, legibilidade alta em mobile).
- **Alvos de toque**: TUDO clicável tem no mínimo **48×48px** (classes `.btn`, `.chip`, inputs).
- **Cards**: Bordas arredondadas, sombras leves (`shadow-sm/`md`), fundo branco/slate-900 no dark mode.
- **Acessibilidade**: `next-themes` (dark/light), labels visíveis em inputs, contraste AA, ícones com `aria-label` quando necessário.

---

## 🗺️ Roadmap Sugerido (Próximos passos)

Se quiser expandir o projeto:
- [ ] **Testes unitários (Vitest + Testing Library)** em checkout/autenticação/produtos (meta 80% cobertura)
- [ ] **Pipeline CI/CD** (GitHub Actions): rodar lint, build e testes a cada push
- [ ] **Teste de carga k6 / JMeter** (500 usuários simultâneos)
- [ ] Integração **Correios SigepWeb** real (frete real + etiquetas)
- [ ] **SEFAZ autorizador real** (geração XML NF-e estruturado)
- [ ] **FCM Firebase** real notificações push + app Android/iOS (Taro/Flutter)
- [ ] **Upload de imagens em bucket** (AWS S3 / Cloudflare R2) ao invés de `public/`
- [ ] **Multi-tenant**: uma instância atendendo múltiplas lojas (whitelabel)
- [ ] App PWA (instalável no celular, funcional offline)
- [ ] ChatBot WhatsApp oficial (Meta Cloud API) com atendimento automático do pedido

---

## 📞 Suporte

Este projeto tem **garantia de suporte técnico de 30 dias após entrega final**, com tempo de resposta máximo de 4 horas úteis para incidentes críticos.

**Contato do desenvolvedor:**
- WhatsApp / Fone: **(83) 00000-0000**
- E-mail: **suporte@modacentersc.com.br**
- Horário: seg a sáb, 08h – 18h

---

## 📜 Licença

Este projeto foi desenvolvido sob **encomenda comercial privada** para a Moda Center Santa Cruz / Cliente final. Toda a propriedade intelectual, códigos, layouts e materiais pertencem ao contratante.

> Made with 💜 in Santa Cruz do Capibaribe (PE) — o polo de moda popular mais querido do Nordeste! 🇧🇷
