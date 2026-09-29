import type { Metadata, Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';
import '@/styles/surfaces.css';
import '@/styles/stealth.css';
import '@/styles/stealth-v3.css';
import '@/styles/stealth-docs-responsive.css';
import '@/styles/fumadocs.css';

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
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <RootProvider search={{ enabled: false }} theme={{ enabled: false, hotKey: false }}>
            {props.children}
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}