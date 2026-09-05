import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
} from 'lucide-react';

const categorias = [
  { href: '/produtos?categoria=feminino', label: 'Feminino' },
  { href: '/produtos?categoria=masculino', label: 'Masculino' },
  { href: '/produtos?categoria=infantil', label: 'Infantil' },
  { href: '/produtos?categoria=acessorios', label: 'Acessórios' },
  { href: '/promocoes', label: 'Promoções' },
];

const legal = [
  { href: '/privacidade', label: 'Política de Privacidade' },
  { href: '/termos', label: 'Termos de Uso' },
  { href: '/exclusao-dados', label: 'Solicitar Exclusão de Dados (LGPD)' },
  { href: '/trocas', label: 'Política de Trocas e Devoluções' },
  { href: '/entregas', label: 'Envios e Prazos' },
];

const institu = [
  { href: '/sobre', label: 'Sobre a Moda Center' },
  { href: '/contato', label: 'Fale Conosco' },
  { href: '/minha-conta', label: 'Minha Conta' },
  { href: '/auth/cadastro', label: 'Cadastre-se' },
  { href: '/minha-conta/pedidos', label: 'Acompanhar Pedidos' },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-20">
      <div className="border-b border-gray-800">
        <div className="container-pad py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Entrega Rápida', desc: 'Para todo o Brasil' },
            { icon: CreditCard, title: 'Até 12x sem juros', desc: 'No cartão' },
            { icon: RotateCcw, title: 'Troca Garantida', desc: 'Em até 30 dias' },
            { icon: Shield, title: 'Site Seguro', desc: 'SSL + PCI DSS' },
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0">
                <b.icon size={20} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{b.title}</p>
                <p className="text-xs text-gray-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-pad py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-white">
              <Image
                src="/logo.png"
                alt="Logo Moda Center Santa Cruz do Capibaribe"
                width={44}
                height={44}
                unoptimized
              />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-white text-xl tracking-tight">Moda Center</p>
              <p className="text-sm font-semibold text-primary-400">Santa Cruz do Capibaribe</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Moda Center Santa Cruz do Capibaribe: referência em moda popular
            no Nordeste. Roupas de qualidade com os melhores preços para toda
            a família.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-primary-400 shrink-0 mt-0.5" />
              <span>
                Av. Prefeito José Severino Ferreira, s/n — Centro
                <br />
                Santa Cruz do Capibaribe — PE · CEP 55190-000
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-primary-400 shrink-0" />
              <a href="tel:08000800800" className="hover:text-primary-400">
                0800 080 0800
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-primary-400 shrink-0" />
              <a href="mailto:contato@omodacenter.com.br" className="hover:text-primary-400">
                contato@omodacenter.com.br
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Rede social"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-primary-500/20 hover:text-primary-400 text-gray-300 flex items-center justify-center transition min-h-[48px] min-w-[48px]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Categorias</h4>
          <ul className="space-y-2.5 text-sm">
            {categorias.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="hover:text-primary-400 min-h-[32px] inline-flex items-center">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Institucional</h4>
          <ul className="space-y-2.5 text-sm">
            {institu.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="hover:text-primary-400 min-h-[32px] inline-flex items-center">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Privacidade e Ajuda</h4>
          <ul className="space-y-2.5 text-sm">
            {legal.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="hover:text-primary-400 min-h-[32px] inline-flex items-center">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-pad py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Moda Center Santa Cruz do Capibaribe — CNPJ 00.000.000/0001-00. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 opacity-60">
            {['Visa', 'Mastercard', 'Elo', 'Amex', 'Pix', 'Boleto'].map((p) => (
              <div
                key={p}
                className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-gray-300"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
