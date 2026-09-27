import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sr-site">
      <a className="sr-skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <a
        className="srv-whatsapp-float"
        href="https://wa.me/447441426993"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open StealthRDP WhatsApp support"
      >
        <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
        <span>WhatsApp support</span>
      </a>
    </div>
  );
}