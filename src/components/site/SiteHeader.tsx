/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { SiteLocale } from '@/config/i18n';
import type { SiteCopy } from '@/content/i18n/site';
import { List as Menu } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { siteCopy } from '@/content/i18n/site';
import { localeHref } from '@/lib/stealth/i18n';
import { LanguageLinks } from './LanguageLinks';
import { WhatsAppMark } from './WhatsAppMark';

const LOGIN_URL = 'https://dash.stealthrdp.com/index.php?rp=/login';

export function SiteHeader({ locale = 'en', copy = siteCopy.en }: { locale?: SiteLocale; copy?: SiteCopy }) {
  const t = copy.header;
  /* One list for the desktop bar and the mobile menu, so the two always match. */
  const mainLinks = t.links.map(([label, href]) => [label, localeHref(href, locale)] as const);
  const home = localeHref('/', locale);
  const plans = localeHref('/plans', locale);
  const mobileNavRef = useRef<HTMLDetailsElement>(null);

  const closeMobileNav = () => {
    if (mobileNavRef.current) {
      mobileNavRef.current.open = false;
    }
  };

  return (
    <header className="srv3-header">
      <div className="sr-container srv3-header-row">
        <Link className="srv3-logo" href={home} aria-label={copy.homeLabel}>
          <img
            src="https://cdn.stealthrdp.com/images/new/6.png"
            alt="StealthRDP"
            width="700"
            height="170"
          />
        </Link>

        <nav className="srv3-nav" aria-label={t.navLabel}>
          {mainLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="srv3-header-actions">
          <a
            className="srv3-whatsapp-link"
            href="https://wa.me/447441426993"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.whatsapp.chatLabel}
          >
            <WhatsAppMark size={28} />
            <span>WhatsApp</span>
          </a>
          <LanguageLinks label={copy.languageLabel} />
          <a className="srv3-login" href={LOGIN_URL}>
            {t.login}
          </a>
          <Button asChild size="sm">
            <Link href={plans}>
              {t.viewPlans}
            </Link>
          </Button>
        </div>

        <a
          className="srv3-mobile-whatsapp"
          href="https://wa.me/447441426993"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.whatsapp.chatLabel}
        >
          <WhatsAppMark size={38} />
          <span className="sr-visually-hidden">{copy.whatsapp.hiddenText}</span>
        </a>

        <details ref={mobileNavRef} className="srv3-mobile-nav">
          <summary>
            <Menu size={16} aria-hidden="true" />
            <span>{t.menu}</span>
          </summary>
          <nav aria-label={t.mobileNavLabel}>
            {mainLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMobileNav}>{label}</Link>)}
            <hr className="srv3-mobile-nav-divider" />
            <a href="https://dash.stealthrdp.com/submitticket.php" onClick={closeMobileNav}>{t.support}</a>
            <a href={LOGIN_URL} onClick={closeMobileNav}>{t.login}</a>
            <LanguageLinks label={copy.languageLabel} />
            <div className="srv3-mobile-nav-cta">
              <Button asChild size="sm">
                <Link href={plans} onClick={closeMobileNav}>{t.viewPlans}</Link>
              </Button>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
