// DashboardBlocks (MIT), copied from its official registry. See THIRD_PARTY_NOTICES.md.

import type { StatusLevel } from '@/components/dashboardblocks/status';
import { StatusBadge } from '@/components/dashboardblocks/status';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/utils/Helpers';

type IncidentUpdate = {
  message: string;
  stage: string;
  time: string;
};

type Status3Props = {
  affected: string[];
  affectedLabel: string;
  statusLabel: string;
  severity: StatusLevel;
  started: string;
  title: string;
  updates: IncidentUpdate[];
};

const Status3 = (props: Status3Props) => {
  const { affected, affectedLabel, statusLabel, severity, started, title, updates } = props;

  return (
    <Card>
      <CardHeader className="gap-2">
        <StatusBadge className="w-fit" status={severity} label={statusLabel} />
        <CardTitle className="text-base">
          <h3>{title}</h3>
        </CardTitle>
        <CardDescription>{started}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">{affectedLabel}</span>
          {affected.map(component => (
            <span
              key={component}
              className="rounded-md bg-muted px-2 py-0.5 font-medium"
            >
              {component}
            </span>
          ))}
        </div>
        <ol className="flex flex-col">
          {updates.map((update, index) => {
            const isLatest = index === 0;
            return (
              <li
                key={`${update.stage}-${update.time}`}
                className="
                  relative flex gap-3 pb-5
                  last:pb-0
                "
              >
                {index < updates.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 bottom-0 left-1.25 w-px bg-border"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    `
                      relative mt-1 size-2.75 shrink-0 rounded-full ring-4
                      ring-card
                    `,
                    isLatest
                      ? (severity === 'maintenance'
                          ? 'bg-primary'
                          : `bg-foreground`)
                      : `bg-muted-foreground/40`,
                  )}
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-medium">{update.stage}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{update.time}</span>
                  </div>
                  <p className="text-sm text-pretty text-muted-foreground">{update.message}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
};

export { Status3 };
