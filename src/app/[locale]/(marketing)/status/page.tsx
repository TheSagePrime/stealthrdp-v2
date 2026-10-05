/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { Pulse } from '@phosphor-icons/react/dist/ssr';
import { StatusBoard } from '@/components/site/status/StatusBoard';
import { Badge } from '@/components/ui/badge';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { getUptimeReport } from '@/lib/stealth/uptime';
import { createPageMetadata } from '@/libs/seo/metadata';

// UptimeRobot data, rebuilt at most every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  path: '/status',
  title: 'Server Status — StealthRDP',
  description: 'Live StealthRDP service status, current availability, and 90-day uptime history for protected service components.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default async function StatusPage() {
  await requirePageLocale('/status');
  const report = await getUptimeReport();

  return (
    <div className="srv-page srv-page-status srv-status-v2">
      <StatusBoard report={report}>
        <Badge variant="outline" className="srv-status-v2-badge">
          <Pulse size={14} weight="fill" aria-hidden="true" />
          Live infrastructure status
        </Badge>
        <h1>Know what is healthy before you open a ticket.</h1>
        <p>
          Current state, daily uptime for the last 90 days and recent incidents for every
          StealthRDP server and platform service, read from our UptimeRobot monitors.
        </p>
      </StatusBoard>
    </div>
  );
}
