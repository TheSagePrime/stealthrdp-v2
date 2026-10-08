import type { StatusLevel } from '@/components/dashboardblocks/status';
// DashboardBlocks (MIT), copied from its official registry. See THIRD_PARTY_NOTICES.md.

import { StatusBadge, StatusIndicator } from '@/components/dashboardblocks/status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getWorstStatus } from './status-utils';

type Service = {
  description?: string;
  name: string;
  status: StatusLevel;
  statusLabel?: string;
};

type Status1Props = {
  description: React.ReactNode;
  services: Service[];
  title: string;
  summary?: string;
};

const summaryLabel: Record<StatusLevel, string> = {
  degraded: 'Degraded performance',
  maintenance: 'Maintenance in progress',
  major: 'Major outage',
  operational: 'All systems operational',
  partial: 'Partial outage',
  unknown: 'Status unknown',
};

const Status1 = (props: Status1Props) => {
  const { description, services, title, summary } = props;
  const overall = getWorstStatus(services.map(service => service.status));

  return (
    <Card>
      <CardHeader className="gap-2">
        <StatusBadge className="w-fit" label={summary ?? summaryLabel[overall]} status={overall} />
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">
          {services.map(service => (
            <li
              key={service.name}
              className="
                flex items-center justify-between gap-4 border-b py-3
                first:pt-0
                last:border-b-0 last:pb-0
              "
            >
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{service.name}</span>
                {service.description && (
                  <span className="text-xs text-muted-foreground">
                    {service.description}
                  </span>
                )}
              </div>
              <StatusIndicator className="shrink-0 text-xs" status={service.status} label={service.statusLabel} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export { Status1 };
