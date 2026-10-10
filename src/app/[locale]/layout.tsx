import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DocsRootProvider } from '@/components/site/DocsRootProvider';
import { TrackingConsent } from '@/components/site/TrackingConsent';
import { docsUiCopy } from '@/content/i18n/docs-ui';
import { siteCopy } from '@/content/i18n/site';
import { asSiteLocale, localeHref } from '@/lib/stealth/i18n';
import { routing } from '@/libs/I18nRouting';
import { isProductionDeployEnv, resolveDeployEnv } from '@/libs/seo/env';
import '@/styles/global.css';
import '@/styles/surfaces.css';
import '@/styles/stealth.css';
import '@/styles/stealth-v3.css';
import '@/styles/fumadocs.css';
import '@/styles/resources.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.stealthrdp.com'),
  applicationName: 'StealthRDP',
  authors: [{ name: 'StealthRDP Team' }],
  manifest: '/site.webmanifest',
  verification: { other: { 'msvalidate.01': 'BC1193DFC35353EA0CED70B0E5F25F09' } },
  icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const production = isProductionDeployEnv(resolveDeployEnv());
  const docsUi = docsUiCopy[asSiteLocale(locale)];
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <DocsRootProvider
            search={{
              options: {
                type: 'static',
                api: '/search-index.json',
                links: [
                  ['Help Center', '/docs'],
                  ['Citadel Docs', '/citadel/docs'],
                  ['Blog', '/blog'],
                  ['Common questions', '/faq'],
                ],
              },
            }}
            theme={{ enabled: false, hotKey: false }}
            i18n={docsUi ? { locale, translations: docsUi } : undefined}
          >
            {props.children}
          </DocsRootProvider>
        </NextIntlClientProvider>
        {production
          ? <TrackingConsent copy={siteCopy[asSiteLocale(locale)].consent} privacyHref={`${localeHref('/privacy', asSiteLocale(locale))}#cookies`} />
          : null}
      </body>
    </html>
  );
}
