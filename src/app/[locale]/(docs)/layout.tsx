/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import { ChatsCircle, Lifebuoy, Pulse, ShieldCheck, SignIn } from '@phosphor-icons/react/dist/ssr';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { siteCopy } from '@/content/i18n/site';
import { docsTree } from '@/lib/stealth/docs-tree';

/* Help Center and Citadel docs use the Fumadocs notebook layout on its own: one navbar with
   search, the sidebar and the table of contents. The marketing header and footer stay on
   the marketing pages. */

const tabIcons: Record<string, ReactNode> = {
  '/docs': <Lifebuoy weight="duotone" />,
  '/citadel/docs': <ShieldCheck weight="duotone" />,
};

export default function DocsRouteLayout({ children }: { children: ReactNode }) {
  const copy = siteCopy.en;
  return (
    <>
      <a className="sr-skip-link" href="#nd-page">{copy.skipToContent}</a>
      <DocsLayout
        tree={docsTree}
        nav={{
          mode: 'top',
          url: '/',
          title: (
            <span className="sr-docs-brand">
              <img src="https://cdn.stealthrdp.com/images/new/6.png" width="700" height="170" alt="StealthRDP" />
              <span>Docs</span>
            </span>
          ),
        }}
        tabMode="navbar"
        tabs={{ transform: tab => ({ ...tab, icon: tabIcons[tab.url] ?? tab.icon }) }}
        links={[
          { text: 'Guides', url: '/blog', icon: <ChatsCircle weight="duotone" /> },
          { text: 'Common questions', url: '/faq' },
          { text: 'Status', url: '/status', icon: <Pulse weight="duotone" /> },
          {
            type: 'button',
            text: 'Client area',
            url: 'https://dash.stealthrdp.com/index.php?rp=/login',
            icon: <SignIn weight="duotone" />,
            external: true,
          },
        ]}
        themeSwitch={{ enabled: false }}
        sidebar={{ defaultOpenLevel: 1 }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
