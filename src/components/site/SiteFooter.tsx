/* eslint-disable better-tailwindcss/no-unknown-classes -- Existing site container. */
/* eslint-disable next/no-img-element */
import type { SiteLocale } from '@/config/i18n';
import type { SiteCopy } from '@/content/i18n/site';
import { SiDiscord, SiInstagram, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import { BookOpen, Buildings, Stack } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { PageHeader, PageHeaderHeading, PageHeaderRow } from '@/components/dashboardblocks/footer-header';
import { FooterNavigation } from '@/components/dashboardblocks/footer-navigation';
import { Button } from '@/components/ui/button';
import { isRouteLocalized } from '@/config/i18n';
import { siteCopy } from '@/content/i18n/site';
import { localeHref } from '@/lib/stealth/i18n';
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
  const legal = t.legal.map(localLink);
  const legalUrls = new Set(t.legal.map(([, href]) => href));
  const columns = t.columns.map(column => ({ title: column.title, links: column.links.filter(([, href]) => !legalUrls.has(href) && !href.includes('submitticket.php') && !href.includes('wa.me/')).map(([label, href]) => localLink([href === '/contact' ? ({ en: 'Contact us', de: 'Kontakt', es: 'Contáctanos' }[locale]) : label, href])) }));

  const icons = [<Stack key="products" size={20} />, <BookOpen key="resources" size={20} />, <Buildings key="company" size={20} />];
  return (
    <footer className="
      border-t border-border bg-muted/20 py-6
      sm:py-8
    "
    >
      <div className="sr-container">
        <div>
          <PageHeader className="mb-6 border-b border-border pb-5">
            <PageHeaderRow className="items-center">
              <PageHeaderHeading
                wrap
                className="max-w-xl"
                title={(
                  <Link
                    href={localeHref('/', locale)}
                    aria-label={copy.homeLabel}
                    className="inline-flex min-h-11 items-center"
                  >
                    <img
                      src="https://cdn.stealthrdp.com/images/new/6.png"
                      alt="StealthRDP"
                      width="700"
                      height="170"
                      loading="lazy"
                      className="
                        h-auto w-40 brightness-0
                        dark:invert
                      "
                    />
                  </Link>
                )}
              />

              <ul className="flex flex-wrap gap-2" aria-label={t.socialLabel}>
                {socials.map(([label, href, Mark]) => (
                  <li key={label}>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="
                        rounded-full bg-muted/60 text-muted-foreground
                        hover:bg-primary/10 hover:text-primary
                      "
                    >
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Mark size={20} aria-hidden="true" /></a>
                    </Button>
                  </li>
                ))}
              </ul>
            </PageHeaderRow>
          </PageHeader>
          <div>
            <FooterNavigation label={t.navLabel} options={columns.map((column, index) => ({ ...column, icon: icons[index] }))} />
            <div className="
              mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2
              border-t border-border py-3
            "
            >
              <p className="text-xs text-muted-foreground">{t.copyright}</p>

              <div className="
                flex flex-wrap items-center gap-x-5 gap-y-1 text-xs
                text-muted-foreground
              "
              >
                {legal.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="
                      inline-flex min-h-11 items-center
                      hover:text-primary
                    "
                  >
                    {label}
                  </Link>
                ))}
                <CookieSettingsButton
                  className="
                    min-h-11
                    hover:text-primary
                  "
                  label={copy.consent.settings}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
