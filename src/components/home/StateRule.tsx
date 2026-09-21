import Link from 'next/link';
import { allReporting, lowestMonitor, monitorTotal, ratioText, reportingTotal } from './registry';

/**
 * The state rule: one line of real figures that stays under the header for the whole page.
 * It is the page's spine. Text only, except the /status link, which acts.
 */
export function StateRule() {
  return (
    <div className="srx-rule" role="note" aria-label="Current platform state">
      <p className="srx-rule-line srx-mono">
        <span className="srx-rule-lead">
          <i className="srx-dot" aria-hidden="true" />
          {allReporting ? 'ALL REPORTING' : 'PARTIAL'}
        </span>
        <span className="srx-rule-count">
          {monitorTotal} MONITORS
        </span>
        <span>
          LOWEST {lowestMonitor ? ratioText(lowestMonitor.uptimeRatio) : '—'}%
        </span>
        <span className="srx-rule-tail">
          {reportingTotal}/{monitorTotal} UP
        </span>
        <Link className="srx-rule-link" href="/status">
          STATUS
        </Link>
      </p>
    </div>
  );
}
