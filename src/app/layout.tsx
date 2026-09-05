import type { Metadata, Viewport } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Toaster } from 'sonner';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Moda Center Santa Cruz do Capibaribe | O Maior Centro Atacadista do Brasil',
    template: '%s | Moda Center',
  },
  description:
    'Moda Center Santa Cruz do Capibaribe: o maior centro atacadista de confecções do Brasil. Localizado em Pernambuco, recebe mais de 150 mil clientes por semana com as melhores marcas de moda feminina, masculina, infantil e acessórios.',
  keywords: [
    'moda center',
    'omodacenter',
    'santa cruz do capibaribe',
    'pernambuco',
    'atacado de roupas',
    'moda atacadista',
    'confecções',
    'moda feminina',
    'moda masculina',
    'moda infantil',
    'acessórios',
    'polo de moda',
    'agrestes pernambucano',
  ],
  authors: [{ name: 'Moda Center Santa Cruz do Capibaribe' }],
  creator: 'Moda Center Santa Cruz do Capibaribe',
  publisher: 'Moda Center Santa Cruz do Capibaribe',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://omodacenter.com.br',
    siteName: 'Moda Center Santa Cruz do Capibaribe',
    title: 'Moda Center Santa Cruz do Capibaribe | O Maior Centro Atacadista do Brasil',
    description:
      'O maior centro atacadista de confecções do Brasil. Mais de 10 mil pontos comerciais, 6 mil vagas de estacionamento e estrutura completa para seus negócios.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moda Center Santa Cruz do Capibaribe | O Maior Centro Atacadista',
    description:
      'Localizado em Santa Cruz do Capibaribe-PE, o Moda Center é referência nacional no atacado de confecções.',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4e017d',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`light ${roboto.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-neutral-50 text-neutral-900 font-sans"
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 w-full">{children}</main>
            <SiteFooter />
          </div>
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: { minHeight: 48, padding: '12px 16px' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
