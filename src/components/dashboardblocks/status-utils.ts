// DashboardBlocks (MIT). See THIRD_PARTY_NOTICES.md.
import type { StatusLevel } from './status';

const severityOrder: StatusLevel[] = ['unknown', 'operational', 'maintenance', 'degraded', 'partial', 'major'];

function getWorstStatus(statuses: StatusLevel[]): StatusLevel {
  return statuses.reduce<StatusLevel>(
    (worst, status) => (severityOrder.indexOf(status) > severityOrder.indexOf(worst) ? status : worst),
    'unknown',
  );
}

export { getWorstStatus };
