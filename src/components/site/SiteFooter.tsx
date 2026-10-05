/* eslint-disable better-tailwindcss/no-unknown-classes, next/no-img-element */
import type { SiteLocale } from '@/config/i18n';
import type { SiteCopy } from '@/content/i18n/site';
import { SiDiscord, SiInstagram, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { isRouteLocalized } from '@/config/i18n';
import { siteCopy } from '@/content/i18n/site';
import { localeHref } from '@/lib/stealth/i18n';
import { LanguageLinks } from './LanguageLinks';
import { CookieSettingsButton } from './TrackingConsent';

/* Same four profiles the brand schema declares in src/config/seo.ts. Official marks from Simple Icons. */
const socials = [
  ['Discord', 'https://discord.gg/9JJFs4DDyF', SiDiscord],
  ['Telegram', 'https://t.me/StealthRDP', SiTelegram],
  ['X', 'https://x.com/stealthrdp', SiX],
  ['Instagram', 'https://www.instagram.com/stealth_rdp', SiInstagram],
] as const;

export function SiteFooter({ locale = 'en', copy = siteCopy.en }: { locale?: SiteLocale; copy?: SiteCopy }) {
  const t = copy.footer;
  /* Internal links point to this language's version when it exists; otherwise to the English
     page, labelled as English for German and Spanish readers. */
  const localLink = ([label, href]: [string, string]): [string, string] => {
    if (!href.startsWith('/')) {
      return [label, href];
    }
    const path = href.split('#')[0] ?? href;
    return locale === 'en' || isRouteLocalized(path, locale)
      ? [label, localeHref(href, locale)]
      : [`${label}${t.englishOnly}`, href];
  };
  const columns = t.columns.map(column => ({ title: column.title, links: column.links.map(localLink) }));
  const legal = t.legal.map(localLink);

  return (
    <footer className="srv3-footer">
      <div className="sr-container srv3-footer-shell">
        <div className="srv3-footer-main">
          <div className="srv3-footer-brand">
            <Link className="srv3-logo srv3-footer-logo" href={localeHref('/', locale)} aria-label={copy.homeLabel}>
              <img
                src="https://cdn.stealthrdp.com/images/new/6.png"
                alt="StealthRDP"
                width="700"
                height="170"
                loading="lazy"
              />
            </Link>

            <p className="srv3-footer-description">
              {t.description}
            </p>

            <div className="srv3-footer-proof" aria-label={t.highlightsLabel}>
              <span>
                <strong>{t.regions[0]}</strong>
                {' '}
                {t.regions[1]}
              </span>
              <span>
                <strong>{t.support[0]}</strong>
                {' '}
                {t.support[1]}
              </span>
            </div>

            <ul className="srv3-socials" aria-label={t.socialLabel}>
              {socials.map(([label, href, Mark]) => (
                <li key={label}>
                  <Button asChild variant="outline" size="icon-sm">
                    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                      <Mark size={16} aria-hidden="true" />
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <nav className="srv3-footer-links" aria-label={t.navLabel}>
            {columns.map(column => (
              <div className="srv3-footer-column" key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map(([label, href]) => (
                    <li key={href}>
                      {href.startsWith('http')
                        ? (
                            <a href={href}>
                              <span>{label}</span>
                              <ArrowUpRight size={14} aria-hidden="true" />
                            </a>
                          )
                        : (
                            <Link href={href}>{label}</Link>
                          )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <nav className="srv3-footer-mobile-links" aria-label={t.navLabel}>
            {columns.map(column => (
              <details key={column.title}>
                <summary>
                  <span>{column.title}</span>
                  <span className="srv3-footer-mobile-toggle" aria-hidden="true">+</span>
                </summary>
                <ul>
                  {column.links.map(([label, href]) => (
                    <li key={href}>
                      {href.startsWith('http')
                        ? (
                            <a href={href}>
                              <span>{label}</span>
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                          )
                        : (
                            <Link href={href}>{label}</Link>
                          )}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
        </div>

        <div className="srv3-footer-bottom">
          <div className="srv3-footer-bottom-main">
            <span className="srv3-footer-copyright">{t.copyright}</span>
            <div className="srv3-footer-legal">
              <LanguageLinks label={copy.languageLabel} />
              <Link href={legal[0]![1]}>{legal[0]![0]}</Link>
              <CookieSettingsButton className="srv3-footer-cookie" label={copy.consent.settings} />
              {legal.slice(1).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
