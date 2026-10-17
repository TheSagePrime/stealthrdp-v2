/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { Pulse } from '@phosphor-icons/react/dist/ssr';
import { StatusBoard } from '@/components/site/status/StatusBoard';
import { StatusLive } from '@/components/site/status/StatusLive';
import { Badge } from '@/components/ui/badge';
import { statusCopy } from '@/content/i18n/status';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getUptimeReport } from '@/lib/stealth/uptime';

// Render fresh server data on refresh; the shared loader caches public metrics for 60 seconds.
export const revalidate = 0;

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
    <div className="srv-page">
      <StatusLive>
        <StatusBoard report={report} t={t.board} locale={locale}>
          <Badge variant="outline" className="w-fit">
            <Pulse size={14} weight="fill" aria-hidden="true" />
            {t.badge}
          </Badge>
          <h1>{t.title}</h1>
          <p className="text-muted-foreground">{t.text}</p>
        </StatusBoard>
      </StatusLive>
    </div>
  );
}
