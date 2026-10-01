import { groupName, groupOrder } from './status-groups';
import styles from './StatusFleet.module.css';

/*
 * Hero panel for /status: the 90-day average and one small bar per
 * monitored service, grouped by region. Bars wrap, so the panel stays the
 * same size as the fleet grows. The scan runs only while the live feed is
 * connected, so a snapshot never looks live. Full detail is in the table.
 */

export type FleetMonitor = {
  label: string;
  region: string;
  status: string;
  uptimeRatio: number | null;
};

const average = (monitors: FleetMonitor[]) => {
  const ratios = monitors.map(monitor => monitor.uptimeRatio).filter((value): value is number => value !== null);
  return ratios.length ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : null;
};

const percent = (value: number | null, digits: number) => (value === null ? '—' : `${value.toFixed(digits)}%`);

export function StatusFleet({ monitors, average: overall, live }: {
  monitors: FleetMonitor[];
  average: number | null;
  live: boolean;
}) {
  const groups = groupOrder
    .map(name => ({ name, members: monitors.filter(monitor => groupName(monitor.region) === name) }))
    .filter(group => group.members.length);
  let index = 0;

  return (
    <div className={styles.panel} data-live={live || undefined} aria-hidden="true">
      <div className={styles.head}>
        <div>
          <span className={styles.label}>90-day average</span>
          <strong className={styles.value}>{percent(overall, 2)}</strong>
        </div>
        <span className={styles.feed}>
          <i />
          {live ? 'Live' : 'Snapshot'}
        </span>
      </div>

      <ul className={styles.groups}>
        {groups.map(group => (
          <li key={group.name}>
            <div className={styles.groupHead}>
              <span>{group.name}</span>
              <span>{`${group.members.length} · ${percent(average(group.members), 2)}`}</span>
            </div>
            <div className={styles.bars}>
              {group.members.map(monitor => (
                <span
                  key={monitor.label}
                  className={styles.bar}
                  data-status={monitor.status}
                  title={`${monitor.label} · ${percent(monitor.uptimeRatio, 3)}`}
                  style={{ '--i': index++ } as React.CSSProperties}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.legend}>
        <span data-status="up">Operational</span>
        <span data-status="degraded">Degraded</span>
        <span data-status="down">Down</span>
      </div>
    </div>
  );
}
