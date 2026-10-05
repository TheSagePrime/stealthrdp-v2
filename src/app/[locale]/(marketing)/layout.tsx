/* eslint-disable better-tailwindcss/no-unknown-classes */
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteTopBar } from '@/components/site/SiteTopBar';
import { WhatsAppMark } from '@/components/site/WhatsAppMark';
import { siteCopy } from '@/content/i18n/site';
import { pageLocale } from '@/lib/stealth/i18n-server';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const locale = await pageLocale();
  const copy = siteCopy[locale];

  return (
    <div className="sr-site">
      <a className="sr-skip-link" href="#main">{copy.skipToContent}</a>
      <SiteTopBar copy={copy} locale={locale} />
      <SiteHeader locale={locale} copy={copy} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} copy={copy} />
      <a
        className="srv-whatsapp-float"
        href="https://wa.me/447441426993"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.whatsapp.floatLabel}
        title={copy.whatsapp.floatText}
      >
        <WhatsAppMark size={56} />
      </a>
    </div>
  );
}
