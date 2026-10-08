import type { StatusLevel } from '@/components/dashboardblocks/status';
// DashboardBlocks (MIT), copied from its official registry. See THIRD_PARTY_NOTICES.md.

import { StatusBadge } from '@/components/dashboardblocks/status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getWorstStatus } from './status-utils';

type Status1Props = {
  description: React.ReactNode;
  statuses: StatusLevel[];
  title: string;
  summary: string;
  stats: { label: string; value: number }[];
};

const Status1 = (props: Status1Props) => {
  const { description, statuses, title, summary, stats } = props;
  const overall = getWorstStatus(statuses);

  return (
    <Card role="region" aria-label={title} className="gap-4 py-4">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle><h2 className="text-base">{title}</h2></CardTitle>
          <StatusBadge className="w-fit" label={summary} status={overall} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="
          grid grid-cols-2 gap-x-6 gap-y-3
          sm:grid-cols-4
        "
        >
          {stats.map(stat => (
            <div key={stat.label} className="grid gap-1">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="text-xl font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

export { Status1 };
