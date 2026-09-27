import type { Metadata } from 'next';
import { CheckCircle, Pulse } from '@phosphor-icons/react/dist/ssr';
import { Badge } from '@/components/ui/badge';
import { StatusGrid } from '@/components/site/StatusGrid';
import { createPageMetadata } from '@/libs/seo/metadata';
import { uptime } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/status',
  title: 'Server Status — StealthRDP',
  description: 'Live StealthRDP service status, current availability, and 90-day uptime history for protected service components.',
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

  const healthy = fallback.monitors.every(monitor => monitor.status === 'up');

  return (
    <div className="srv-page srv-page-status srv-status-v2">
      <section className="srv-status-v2-hero">
        <div className="sr-container srv-status-v2-hero-grid">
          <div className="srv-status-v2-copy">
            <Badge variant="outline" className="srv-status-v2-badge">
              <Pulse size={14} weight="fill" aria-hidden="true" />
              Live infrastructure status
            </Badge>
            <h1>Know what is healthy before you open a ticket.</h1>
            <p>
              Current availability and 90-day uptime for StealthRDP infrastructure,
              refreshed from the public status feed when available.
            </p>
          </div>

          <div className="srv-status-v2-headline" data-state={healthy ? 'ok' : 'attention'}>
            <span className="srv-status-v2-headline-icon" aria-hidden="true">
              <CheckCircle size={24} weight="fill" />
            </span>
            <div>
              <small>Current state</small>
              <strong>{healthy ? 'All monitored services operational' : 'Some services need attention'}</strong>
              <span>{fallback.monitors.length} monitored services</span>
            </div>
          </div>
        </div>
      </section>

      <section className="srv-status-v2-body">
        <div className="sr-container">
          <StatusGrid fallback={fallback} />
        </div>
      </section>
    </div>
  );
}
