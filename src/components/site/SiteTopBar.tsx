/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { SiteCopy } from '@/content/i18n/site';
import { LanguageLinks } from './LanguageLinks';
import { WhatsAppMark } from './WhatsAppMark';

/* The thin strip above the header: WhatsApp on the left, the language switch on the right.
   It scrolls away; the header below it stays. */
export function SiteTopBar({ copy }: { copy: SiteCopy }) {
  return (
    <div className="srv3-topbar">
      <div className="sr-container srv3-topbar-row">
        <a
          className="srv3-topbar-whatsapp"
          href="https://wa.me/447441426993"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppMark size={22} />
          <span className="srv3-wa-long">{copy.header.whatsapp}</span>
          <span className="srv3-wa-short">WhatsApp</span>
        </a>
        <LanguageLinks label={copy.languageLabel} variant="names" />
      </div>
    </div>
  );
}
