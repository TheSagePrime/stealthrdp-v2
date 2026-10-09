/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import { BookOpenText, ChatsCircle, Lifebuoy, Pulse, ShieldCheck, SignIn, Tag } from '@phosphor-icons/react/dist/ssr';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteCopy } from '@/content/i18n/site';
import { docsTree } from '@/lib/stealth/docs-tree';
import { asSiteLocale, localeHref } from '@/lib/stealth/i18n';

/* Every resource page (Help Center, Citadel docs, guides, common questions and the resources
   hub) uses the default Fumadocs docs layout, as on fumadocs.dev: the logo, search and the
   section switcher in the sidebar, the page in the content panel and the table of contents
   beside it. The marketing header and footer stay on the marketing pages. */

export default async function DocsRouteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = asSiteLocale((await params).locale);
  const copy = siteCopy[locale];
  const tree = docsTree(locale);
  const statusLabel = copy.header.links.find(([, url]) => url === '/status')?.[0] ?? 'Server Status';
  const tabIcons: Record<string, ReactNode> = {
    '/docs': <Lifebuoy weight="duotone" />,
    '/citadel/docs': <ShieldCheck weight="duotone" />,
    '/blog': <BookOpenText weight="duotone" />,
    [localeHref('/faq', locale)]: <ChatsCircle weight="duotone" />,
  };

  return (
    <div className="sr-docs-root">
      <a className="sr-skip-link" href="#nd-page">{copy.skipToContent}</a>
      <DocsLayout
        tree={tree}
        nav={{
          url: localeHref('/', locale),
          title: (
            <span className="sr-docs-brand">
              <img src="https://cdn.stealthrdp.com/images/new/6.png" width="700" height="170" alt="StealthRDP" />
            </span>
          ),
        }}
        tabs={{ transform: tab => ({ ...tab, icon: tabIcons[tab.url] ?? tab.icon }) }}
        links={[
          { text: copy.header.viewPlans, url: localeHref('/plans', locale), icon: <Tag /> },
          { text: statusLabel, url: localeHref('/status', locale), icon: <Pulse /> },
          {
            type: 'button',
            text: copy.header.login,
            url: 'https://dash.stealthrdp.com/index.php?rp=/login',
            icon: <SignIn />,
            external: true,
          },
        ]}
        themeSwitch={{ enabled: false }}
        sidebar={{ defaultOpenLevel: 1 }}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
