/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { Pulse } from '@phosphor-icons/react/dist/ssr';
import { StatusGrid } from '@/components/site/StatusGrid';
import { Badge } from '@/components/ui/badge';
import { uptime } from '@/lib/stealth/content';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/status',
  title: 'Server Status — StealthRDP',
  description: 'Live StealthRDP service status, current availability, and 90-day uptime history for protected service components.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function StatusPage() {
  const fallback = {
    stat: uptime.stat,
    checkedAt: null,
    monitors: uptime.monitors.map(monitor => ({
      label: monitor.label,
      region: monitor.region,
      status: monitor.status,
      uptimeRatio: monitor.uptimeRatio,
    })),
  };

  return (
    <div className="srv-page srv-page-status srv-status-v2">
      <StatusGrid fallback={fallback}>
        <Badge variant="outline" className="srv-status-v2-badge">
          <Pulse size={14} weight="fill" aria-hidden="true" />
          Live infrastructure status
        </Badge>
        <h1>Know what is healthy before you open a ticket.</h1>
        <p>
          Current availability and 90-day uptime for StealthRDP infrastructure,
          refreshed from the public status feed when available.
        </p>
      </StatusGrid>
    </div>
  );
}
