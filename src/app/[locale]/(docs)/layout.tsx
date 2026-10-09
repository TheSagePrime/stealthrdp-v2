/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import { ChatsCircle, Lifebuoy, Pulse, Question, ShieldCheck, SignIn } from '@phosphor-icons/react/dist/ssr';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteCopy } from '@/content/i18n/site';
import { docsTree } from '@/lib/stealth/docs-tree';

/* Help Center and Citadel docs use the default Fumadocs docs layout on its own, as on
   fumadocs.dev: the logo, the Help Center / Citadel switcher, search and the page tree in the
   sidebar, the article in the content panel and the table of contents beside it. The marketing
   header and footer stay on the marketing pages. */

const tabIcons: Record<string, ReactNode> = {
  '/docs': <Lifebuoy weight="duotone" />,
  '/citadel/docs': <ShieldCheck weight="duotone" />,
};

export default function DocsRouteLayout({ children }: { children: ReactNode }) {
  const copy = siteCopy.en;
  return (
    <div className="sr-docs-root">
      <a className="sr-skip-link" href="#nd-page">{copy.skipToContent}</a>
      <DocsLayout
        tree={docsTree}
        nav={{
          url: '/',
          title: (
            <span className="sr-docs-brand">
              <img src="https://cdn.stealthrdp.com/images/new/6.png" width="700" height="170" alt="StealthRDP" />
              <span>Docs</span>
            </span>
          ),
        }}
        tabs={{ transform: tab => ({ ...tab, icon: tabIcons[tab.url] ?? tab.icon }) }}
        links={[
          { text: 'Guides', url: '/blog', icon: <ChatsCircle /> },
          { text: 'Common questions', url: '/faq', icon: <Question /> },
          { text: 'Service status', url: '/status', icon: <Pulse /> },
          {
            type: 'button',
            text: 'Client area',
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
