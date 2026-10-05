/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { Pulse } from '@phosphor-icons/react/dist/ssr';
import { StatusBoard } from '@/components/site/status/StatusBoard';
import { Badge } from '@/components/ui/badge';
import { statusCopy } from '@/content/i18n/status';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getUptimeReport } from '@/lib/stealth/uptime';

// UptimeRobot data, rebuilt at most every 5 minutes.
export const revalidate = 300;

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/status', {
    en: { ...statusCopy.en.meta, ogImage },
    de: { ...statusCopy.de.meta, ogImage },
    es: { ...statusCopy.es.meta, ogImage },
  });
}

export default async function StatusPage() {
  const locale = await requirePageLocale('/status');
  const t = statusCopy[locale];
  const report = await getUptimeReport();

  return (
    <div className="srv-page srv-page-status srv-status-v2">
      <StatusBoard report={report} t={t.board}>
        <Badge variant="outline" className="srv-status-v2-badge">
          <Pulse size={14} weight="fill" aria-hidden="true" />
          {t.badge}
        </Badge>
        <h1>{t.title}</h1>
        <p>{t.text}</p>
      </StatusBoard>
    </div>
  );
}
