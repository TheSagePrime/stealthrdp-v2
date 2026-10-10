// DashboardBlocks (MIT), copied from its official registry. See THIRD_PARTY_NOTICES.md.

import type { UptimeDay } from '@/components/dashboardblocks/status';
import { StatusLegend, UptimeBar } from '@/components/dashboardblocks/status';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ServiceUptime = {
  days: UptimeDay[];
  name: string;
  uptime: string;
};

type Status2Props = {
  description: string;
  services: ServiceUptime[];
  title: string;
  startLabel: string;
  endLabel: string;
  uptimeLabel: string;
};

const Status2 = (props: Status2Props) => {
  const { description, services, title, startLabel, endLabel, uptimeLabel } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <StatusLegend statuses={['operational', 'degraded', 'partial', 'major', 'maintenance']} />
        <ul className="flex flex-col gap-6">
          {services.map(service => (
            <li key={service.name} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium">{service.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  <span className="font-medium text-foreground">{service.uptime}</span>
                  {' '}
                  {uptimeLabel}
                </span>
              </div>
              <UptimeBar days={service.days} label={service.name} />
            </li>
          ))}
        </ul>
        <div className="
          -mt-3 flex justify-between text-xs text-muted-foreground
        "
        >
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export { Status2 };
