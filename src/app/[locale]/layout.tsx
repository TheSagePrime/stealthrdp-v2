import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import { isProductionDeployEnv, resolveDeployEnv } from '@/libs/seo/env';
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
  const production = isProductionDeployEnv(resolveDeployEnv());
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <RootProvider search={{ enabled: false }} theme={{ enabled: false, hotKey: false }}>
            {props.children}
          </RootProvider>
        </NextIntlClientProvider>
        {production ? (
          <>
            <Script id="stealthrdp-gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://sgtm.stealthrdp.com/2l3xebiqyzc.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','yw=Ch5ENj0vSDYwSUBGOjFcXhVHS19YRAEWXgkNFAgOERARHglfCg0I');`}
            </Script>
            <Script
              id="stealthrdp-datafa"
              src="https://datafa.st/js/script.js"
              data-website-id="dfid_6O4WzLRhSgrGULypBOc8I"
              data-domain="stealthrdp.com"
              strategy="afterInteractive"
            />
          </>
        ) : null}
      </body>
    </html>
  );
}