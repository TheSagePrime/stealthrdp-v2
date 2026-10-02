import type { DisplayField, DomainView, ResourceView } from './catalog';

import { z } from 'zod';
import { CitadelError } from './upstream';
import 'server-only';

const domainSchema = z.object({
  id: z.uuid(),
  domain: z.string().min(1).max(253).optional(),
  hostname: z.string().min(1).max(253).optional(),
  name: z.string().min(1).max(253).optional(),
  status: z.string().max(80).optional(),
  organization_id: z.uuid().optional(),
});

export function projectDomains(data: unknown, organisation: string): DomainView[] {
  const envelope = z.object({ domains: z.array(z.unknown()).max(500) }).safeParse(data);
  const values = Array.isArray(data) ? data : envelope.success ? envelope.data.domains : null;
  if (!values || values.length > 500) {
    throw new CitadelError(502, 'Citadel returned an unsupported domain list.');
  }
  return values.map((value) => {
    const parsed = domainSchema.safeParse(value);
    if (!parsed.success) {
      throw new CitadelError(502, 'Citadel returned an unsupported domain record.');
    }
    const domain = parsed.data;
    if (domain.organization_id && domain.organization_id !== organisation) {
      throw new CitadelError(403, 'The domain does not belong to this organisation.');
    }
    const name = domain.domain || domain.hostname || domain.name;
    if (!name || !/^[a-z0-9.-]+$/i.test(name)) {
      throw new CitadelError(502, 'Citadel returned an unsupported hostname.');
    }
    return { id: domain.id, name, status: safeText(domain.status || 'Unknown') };
  });
}

// Explicit display allowlist: unknown fields, credential fields, HTML and upstream errors never reach the browser.
const displayKeys = new Set([
  'name',
  'domain',
  'hostname',
  'status',
  'state',
  'enabled',
  'active',
  'mode',
  'level',
  'profile',
  'preset',
  'challenge_level',
  'challengeLevel',
  'challenge_mode',
  'plan',
  'plan_name',
  'planName',
  'role',
  'email',
  'email_verified',
  'scopes',
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  'expires_at',
  'expiresAt',
  'last_used_at',
  'lastUsedAt',
  'timestamp',
  'time',
  'date',
  'type',
  'action',
  'reason',
  'host',
  'port',
  'tls',
  'origin_host',
  'originHost',
  'origin_port',
  'originPort',
  'origin_tls',
  'originTls',
  'ip',
  'path',
  'method',
  'status_code',
  'statusCode',
  'country',
  'asn',
  'latency_ms',
  'latencyMs',
  'response_time_ms',
  'responseTimeMs',
  'requests',
  'total_requests',
  'totalRequests',
  'blocked',
  'challenged',
  'proxied',
  'allowed',
  'edge',
  'proxy',
  'count',
  'duration',
  'duration_seconds',
  'durationSeconds',
  'bytes',
  'used_bytes',
  'usedBytes',
  'limit_bytes',
  'limitBytes',
  'remaining_bytes',
  'remainingBytes',
  'bandwidth',
  'bandwidth_used',
  'bandwidthUsed',
  'bandwidth_limit',
  'bandwidthLimit',
  'domain_limit',
  'domainLimit',
  'domains_used',
  'domainsUsed',
  'quota',
  'usage',
  'ttl',
  'ttl_seconds',
  'ttlSeconds',
  'max_age',
  'maxAge',
  'max_size',
  'maxSize',
  'rate',
  'rate_limit',
  'rateLimit',
  'window',
  'window_seconds',
  'windowSeconds',
  'burst',
  'timeout',
  'timeout_seconds',
  'timeoutSeconds',
  'speed',
  'attack_start',
  'attackStart',
  'attack_end',
  'attackEnd',
  'awaiting_dns',
  'awaitingDns',
  'schedule',
  'timezone',
  'start',
  'end',
  'days',
  'custom',
  'template',
  'healthy',
]);
const containerKeys = new Set([
  'data',
  'settings',
  'policy',
  'challenge',
  'lockdown',
  'cache',
  'limits',
  'blocklists',
  'incident',
  'schedules',
  'bans',
  'origins',
  'backend',
  'branding',
  'events',
  'logs',
  'analytics',
  'series',
  'metrics',
  'service',
  'bandwidth',
  'notifications',
  'feed',
  'members',
  'invites',
  'team',
  'webhooks',
  'keys',
  'items',
  'points',
  'results',
]);

function safeText(value: string): string {
  return value.replace(/\bBearer\s+\S+|\bcitadel_[prw]_\S+/gi, '[redacted]').slice(0, 400);
}

function labelFor(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function projectResource(data: unknown): ResourceView {
  const fields: DisplayField[] = [];
  const rows: DisplayField[][] = [];
  function visit(value: unknown, target: DisplayField[], prefix = '', depth = 0): void {
    if (depth > 5 || !value || typeof value !== 'object') {
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value.slice(0, 50)) {
        const row: DisplayField[] = [];
        visit(item, row, prefix, depth + 1);
        if (row.length && rows.length < 50) {
          rows.push(row);
        }
      }
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (target.length >= 40) {
        break;
      }
      const label = prefix ? `${prefix} · ${labelFor(key)}` : labelFor(key);
      if (displayKeys.has(key)) {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
          // Log paths can contain credentials in the query string. Omit that entire suffix.
          const text = typeof child === 'boolean' ? (child ? 'On' : 'Off') : String(child);
          target.push({ label, value: safeText(key === 'path' ? text.split(/[?#]/)[0]! : text) });
        } else if (Array.isArray(child) && child.every(item => typeof item === 'string')) {
          target.push({ label, value: safeText(child.slice(0, 20).join(', ')) });
        } else {
          visit(child, target, label, depth + 1);
        }
      } else if (containerKeys.has(key)) {
        visit(child, target, prefix, depth + 1);
      }
    }
  }
  visit(data, fields);
  return { fields, rows };
}
