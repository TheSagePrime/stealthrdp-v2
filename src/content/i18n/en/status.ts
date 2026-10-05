/* The status page in English: hero words and the status board (src/components/site/status).
   Service names and incident reasons come from UptimeRobot and are shown as they are. */

const status = {
  meta: {
    title: 'Server Status — StealthRDP',
    description: 'Live StealthRDP service status, current availability, and 90-day uptime history for protected service components.',
  },
  badge: 'Live infrastructure status',
  title: 'Know what is healthy before you open a ticket.',
  text: 'Current state, daily uptime for the last 90 days and recent incidents for every StealthRDP server and platform service, read from our UptimeRobot monitors.',
  board: {
    states: { up: 'Operational', down: 'Down', paused: 'Paused', unknown: 'Unknown' },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    /** "12 Sep 2026". */
    day: (date: number, month: string, year: number) => `${date} ${month} ${year}`,
    percent: (value: string) => `${value}%`,
    decimal: '.',
    noRecords: (date: string) => `${date}: no records`,
    downFor: (duration: string) => `, ${duration} down`,
    barsLabel: (name: string, uptime: string, troubled: number, total: number) =>
      `${name}: ${uptime} uptime in 90 days; ${troubled} of ${total} days had downtime.`,
    daysAgo: (count: number) => `${count} days ago`,
    today: 'Today',
    noHistory: 'Daily history is not available right now.',
    uptime30: 'Uptime, 30 days',
    uptime90: 'Uptime, 90 days',
    averageResponse: 'Average response',
    lastIncident: 'Last incident',
    noneRecorded: 'None recorded',
    recentIncidents: 'Recent incidents',
    latestOnly: 'Latest incident for each service, last 90 days',
    last90: 'Last 90 days',
    incident: (duration: string, started: string) => `Down for ${duration} · started ${started}`,
    noIncidents: 'No incidents in the last 90 days.',
    allUp: (total: number) => `All ${total} services operational`,
    someDown: (down: number, total: number) => `${down} of ${total} services down`,
    someUp: (up: number, total: number) => `${up} of ${total} services operational`,
    snapshot: (date: string) => `Live data is unavailable. Showing the snapshot from ${date}.`,
    checked: (time: string) => `Checked ${time} · refreshed every 5 minutes`,
    averageUptime: 'Average uptime, 90 days',
    servicesUp: 'Services up',
    noneIn90: 'None in 90 days',
    /* Display names of the groups in src/lib/stealth/uptime.ts groupOrder. */
    groups: {} as Record<string, string>,
    serviceCount: (count: number): string => `${count} service${count === 1 ? '' : 's'}`,
    legendLabel: 'Bar colours',
    legend: ['100%', '99% to 100%', '95% to 99%', 'Under 95%', 'No records'],
    help: {
      title: 'Something looks wrong on your server?',
      text: 'Status covers shared infrastructure. Account or server-specific issues still need support.',
      whatsapp: 'WhatsApp support',
      ticket: 'Open a ticket',
    },
  },
};

export type StatusCopy = typeof status;
export type StatusBoardCopy = StatusCopy['board'];

export default status;
