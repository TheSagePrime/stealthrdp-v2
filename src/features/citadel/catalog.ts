export type DisplayField = { label: string; value: string };
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type ResourceView = { fields: DisplayField[]; rows: DisplayField[][]; data?: Record<string, JsonValue> };
export type DomainView = { id: string; name: string; status: string; dnsStatus?: string; connectionMode?: string };
export type SessionView = {
  email: string;
  role: 'owner' | 'admin' | 'member';
  organisation: { id: string; name: string };
  csrf: string;
  expiresAt: number;
};

// Customer paths come from the v1 handoff; identity and credential creation stay outside this boundary.
export const accountResources = [
  { path: 'service', title: 'Your service' },
  { path: 'service/bandwidth', title: 'Bandwidth' },
  { path: 'analytics', title: 'Traffic analytics' },
  { path: 'analytics/live', title: 'Latest traffic' },
  { path: 'notifications/feed', title: 'Notifications' },
  { path: 'notifications/settings', title: 'Email alerts' },
  { path: 'team', title: 'Team' },
  { path: 'webhooks', title: 'Webhooks' },
  { path: 'api-keys', title: 'API key metadata' },
] as const;

export const domainResources = [
  { path: 'challenge', title: 'Challenge level', group: 'security' },
  { path: 'policy', title: 'Security policy', group: 'security' },
  { path: 'lockdown', title: 'Lockdown', group: 'security' },
  { path: 'rate-limit', title: 'Rate limits', group: 'security' },
  { path: 'blocklists', title: 'Managed blocklists', group: 'security' },
  { path: 'incident', title: 'Incident protection', group: 'security' },
  { path: 'schedules', title: 'Protection schedules', group: 'security' },
  { path: 'origin', title: 'Origin hosts', group: 'origin' },
  { path: 'backend', title: 'Backend summary', group: 'origin' },
  { path: 'cache', title: 'Cache settings', group: 'delivery' },
  { path: 'bandwidth-limits', title: 'Bandwidth limits', group: 'delivery' },
  { path: 'branding', title: 'Challenge page branding', group: 'delivery' },
  { path: 'events', title: 'Attack and mitigation events', group: 'activity' },
  { path: 'logs', title: 'Request logs', group: 'activity' },
] as const;

export type DomainAction = 'refresh' | 'protection' | 'restore-defaults' | 'remove';
