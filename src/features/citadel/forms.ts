export type FieldSpec = {
  key: string;
  label: string;
  kind?: 'number' | 'boolean' | 'list' | 'numbers' | 'select' | 'textarea' | 'records';
  options?: string[];
  optionsFrom?: string;
  fields?: FieldSpec[];
  min?: number;
  max?: number;
  step?: number;
  optional?: boolean;
  help?: string;
  initial?: string | number | boolean;
};
export type FormSpec = { title: string; method: string; fields: FieldSpec[]; note?: string; fresh?: boolean; query?: string; action?: string };
const levels = ['auto', 'off', 'cookie', 'js', 'interact', 'lockdown'];
const profiles = ['balanced', 'api_friendly', 'strict', 'under_attack'];
const pageTypes = ['js', 'interact', 'lockdown', 'error_blocked', 'error_ratelimit', 'error_origin'];
const field = (key: string, label: string, kind?: FieldSpec['kind'], extra: Partial<FieldSpec> = {}): FieldSpec => ({ key, label, kind, ...extra });
const number = (key: string, label: string, min: number, max: number): FieldSpec => field(key, label, 'number', { min, max });
const list = (key: string, label: string, help = 'One entry per line.'): FieldSpec => field(key, label, 'list', { help });
const select = (key: string, label: string, options: string[], initial?: string): FieldSpec => field(key, label, 'select', { options, initial });
const records = (key: string, label: string, fields: FieldSpec[]): FieldSpec => field(key, label, 'records', { fields });
const scheduleFields = [field('name', 'Schedule name'), select('profileId', 'Protection profile', profiles, 'strict'), number('hourStart', 'Start hour (0–23)', 0, 23), number('hourEnd', 'End hour (1–24)', 1, 24), field('daysOfWeek', 'Days of week (0 Sunday – 6 Saturday)', 'numbers', { help: 'One day number per line.', initial: '' }), field('timezone', 'Time zone', undefined, { initial: 'UTC', help: 'For example UTC or Europe/London.' }), field('enabled', 'Schedule enabled', 'boolean', { initial: true })];

export const formSpecs: Record<string, FormSpec[]> = {
  'domains': [{ title: 'Add domain', method: 'POST', fresh: true, fields: [field('domain', 'Domain name'), field('originHost', 'Origin host or IP'), field('originPort', 'Origin port', 'number', { min: 1, max: 65535, initial: 443 }), field('originTls', 'Use TLS to the origin', 'boolean', { initial: true })], note: 'Use the real backend host. After adding the domain, check its Cloudflare routing and protection status.' }],
  'challenge': [{ title: 'Save challenge level', method: 'PATCH', fields: [select('level', 'Challenge level', levels), select('auto_baseline', 'Auto baseline', ['cookie', 'js'])], note: 'Changing the challenge may require visitors to pass it again. Off disables challenges. Lockdown restricts access.' }],
  'policy': [{ title: 'Save security policy', method: 'PATCH', fields: [
    list('whitelistIps', 'Allowed IPs and CIDRs'),
    list('whitelistPaths', 'Allowed path prefixes'),
    list('whitelistAgents', 'Allowed user agents'),
    number('cookieTtlSec', 'Challenge session lifetime (seconds)', 60, 86400),
    number('autoHotStreak', 'Hot streak', 1, 20),
    number('autoEscalateProxied', 'Escalation threshold', 1, 10000),
    number('autoCoolDownSec', 'Cool down (seconds)', 30, 86400),
    number('banStrikes', 'Strikes before a ban', 1, 100),
    number('banTtlSec', 'Ban lifetime (seconds)', 60, 86400),
    records('pathRules', 'Path challenge rules', [field('path', 'Path prefix'), select('level', 'Challenge', ['bypass', 'off', 'cookie', 'js', 'interact', 'lockdown'])]),
    list('countryAllow', 'Allowed countries', 'Two-letter country codes, one per line.'),
    list('countryBlock', 'Blocked countries', 'Two-letter country codes, one per line.'),
    field('asnAllow', 'Allowed ASNs', 'numbers'),
    field('asnBlock', 'Blocked ASNs', 'numbers'),
    list('allowedMethods', 'Allowed HTTP methods'),
    records('methodRules', 'Method overrides', [select('method', 'HTTP method', ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']), select('level', 'Challenge override', ['bypass', 'off', 'cookie', 'js', 'interact', 'lockdown']), field('rateLimitRps', 'Requests per second', 'number', { optional: true, min: 0.1, max: 100000, step: 0.1 }), field('rateLimitBurst', 'Burst', 'number', { optional: true, min: 0.1, max: 100000, step: 0.1 })]),
  ], note: 'Allowlists bypass checks. Rules run in order; place more specific paths first. Review changes before saving.' }],
  'lockdown': [{ title: 'Save lockdown allowlist', method: 'PATCH', fields: [list('ips', 'Allowed IPs and CIDRs'), list('paths', 'Allowed paths'), field('reason', 'Reason')], note: 'These rules control access while lockdown is active.' }],
  'rate-limit': [{ title: 'Save rate preset', method: 'PATCH', fields: [field('preset', 'Rate preset', 'select', { optionsFrom: 'presets' })] }],
  'blocklists': [{ title: 'Save blocklists', method: 'PATCH', fields: [field('presets', 'Enabled blocklists', 'list', { optionsFrom: 'available' }), field('soft', 'Blocklists using a challenge', 'list', { optionsFrom: 'available' })], note: 'Soft mode challenges visitors instead of returning 403. Only supported enabled lists can use it.' }],
  'origin': [
    { title: 'Save origins', method: 'POST', fields: [records('origins', 'Origins', [field('hostname', 'Protected hostname'), field('originUrl', 'Backend URL', undefined, { help: 'HTTP or HTTPS URL including the port. No path, credentials or query.' }), field('enabled', 'Enabled', 'boolean', { initial: true })])], note: 'Hostnames must belong to this domain. Keep at least one origin enabled.' },
    { title: 'Check origin health', method: 'POST', action: 'origin-check', fresh: true, fields: [field('hostname', 'Saved origin hostname', 'select', { optionsFrom: 'origins' })] },
    { title: 'Remove subdomain origin', method: 'DELETE', fresh: true, fields: [field('hostname', 'Subdomain hostname', 'select', { optionsFrom: 'origins' })], note: 'The main domain origin cannot be removed.' },
  ],
  'cache': [
    { title: 'Save cache settings', method: 'PATCH', fields: [field('enabled', 'Cache enabled', 'boolean'), number('ttlSec', 'Cache lifetime (seconds)', 1, 604800), number('maxMb', 'Maximum cache size (MB)', 1, 10000), field('extensions', 'Cached extensions', 'list', { optionsFrom: 'availableExtensions' }), list('bypassPaths', 'Bypass path prefixes')], note: 'Cache static assets only. Bypass authenticated and private content.' },
    { title: 'Purge cache', method: 'POST', fresh: true, fields: [field('path', 'Path prefix', undefined, { optional: true, help: 'Leave empty to purge the entire domain cache.' })] },
  ],
  'bandwidth-limits': [{ title: 'Save speed limits', method: 'PATCH', fields: [records('rules', 'Speed limit rules', [select('scope', 'Rule type', ['extension', 'path', 'subdomain', 'domain']), field('match', 'Match', undefined, { help: 'For example .zip or /downloads/. Domain rules use an empty match.', optional: true }), field('limit_mbps', 'Limit (MB/s)', 'number', { min: 0.1, max: 1000, step: 0.1, initial: 5 }), select('mode', 'Limit mode', ['connection', 'total'], 'connection')])], note: 'First matching rule wins. One rule per type. Per connection limits each download; total shares a pool.' }],
  'incident': [
    { title: 'Activate incident protection', method: 'POST', fresh: true, fields: [select('profileId', 'Incident profile', profiles, 'under_attack'), select('minutes', 'Duration (minutes)', ['15', '30', '60', '120', '240'], '30')], note: 'The API records the previous level and a reversion time.' },
    { title: 'Clear incident protection', method: 'DELETE', fresh: true, fields: [], note: 'Ends the current incident protection.' },
  ],
  'schedules': [{ title: 'Add protection schedule', method: 'POST', fresh: true, fields: scheduleFields, note: 'Schedule times use the selected time zone. Automatic execution currently requires the existing Citadel portal to remain open.' }],
  'branding': [
    { title: 'Save page branding', method: 'PUT', fresh: true, fields: [select('pageType', 'Page type', pageTypes, 'js'), field('html', 'HTML page shell', 'textarea', { help: 'Keep {{BRAND}} and {{MESSAGE}} placeholders. The shell is edited as text.' })], note: 'Create a custom shell for visitors who meet a challenge or error.' },
    { title: 'Restore page default', method: 'DELETE', fresh: true, query: 'type', fields: [select('type', 'Page type to restore', pageTypes)] },
  ],
  'webhooks': [{ title: 'Add webhook', method: 'POST', fresh: true, fields: [field('name', 'Webhook name'), select('kind', 'Webhook type', ['slack', 'discord', 'generic'], 'generic'), field('url', 'HTTPS webhook URL')], note: 'Citadel sends organisation security alerts to this destination. Treat webhook URLs as secrets.' }],
  'notifications/settings': [{ title: 'Save email alerts', method: 'PATCH', fields: [field('emailEnabled', 'Enable email alerts', 'boolean'), field('emailEvents', 'Alert events', 'list', { optionsFrom: 'options' }), list('bccEmails', 'BCC recipients', 'One email per line; maximum 20. BCC receives organisation security alerts.')] }],
};
export const scheduleEditSpec: FormSpec = { title: 'Save protection schedule', method: 'PATCH', fields: [field('id', 'Schedule ID'), ...scheduleFields] };
