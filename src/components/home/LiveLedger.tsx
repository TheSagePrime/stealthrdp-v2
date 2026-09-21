import {
  allReporting,
  lowestMonitor,
  monitorTotal,
  monitors,
  ratioText,
  reportingTotal,
} from './registry';

/**
 * The live infrastructure record.
 * Nine real monitors, their real uptime ratios, straight from src/content/uptime.json.
 * This is the dominant element of the first screenful: the evidence sits on the same
 * sheet as the claim.
 */
export function LiveLedger() {
  return (
    <section className="srx-ledger" aria-labelledby="srx-ledger-title">
      <div className="srx-ledger-head">
        <h2 className="srx-ledger-title" id="srx-ledger-title">
          Live infrastructure record
        </h2>
        <p className="srx-ledger-source srx-mono">
          SOURCE /status · {monitorTotal} MONITORS · {reportingTotal} REPORTING
        </p>
      </div>

      <ul className="srx-ledger-rows">
        {monitors.map(monitor => (
          <li className="srx-lrow" key={monitor.label}>
            <span className="srx-lrow-region srx-mono">{monitor.region}</span>
            <span className="srx-lrow-node">{monitor.label}</span>
            <span className="srx-lrow-figure srx-mono">
              {ratioText(monitor.uptimeRatio)}
              <em>%</em>
            </span>
            <span
              className={`srx-lrow-state srx-mono${monitor.status === 'up' ? ' srx-is-up' : ' srx-is-down'}`}
            >
              <i className="srx-dot" aria-hidden="true" />
              {monitor.status === 'up' ? 'Reporting' : 'Not reporting'}
            </span>
          </li>
        ))}
      </ul>

      <p className="srx-ledger-foot srx-mono">
        <span>
          LOWEST {lowestMonitor ? ratioText(lowestMonitor.uptimeRatio) : '—'}%
          {lowestMonitor ? ` · ${lowestMonitor.label.toUpperCase()}` : ''}
        </span>
        <span>{allReporting ? 'ALL MONITORS REPORTING' : 'PARTIAL REPORTING'}</span>
      </p>
    </section>
  );
}
