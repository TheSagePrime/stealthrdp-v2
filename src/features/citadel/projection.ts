import type { DisplayField, DomainView, JsonValue, ResourceView } from './catalog';

import { z } from 'zod';
import { CitadelError } from './upstream';
import 'server-only';

const domainSchema = z.object({
  id: z.uuid(),
  domain: z.string().min(1).max(253).optional(),
  hostname: z.string().min(1).max(253).optional(),
  name: z.string().min(1).max(253).optional(),
  status: z.string().max(80).optional(),
  protection_status: z.string().max(80).optional(),
  cloudflare_status: z.string().max(80).optional(),
  connection_mode: z.string().max(80).optional(),
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
    return { id: domain.id, name, status: safeText(domain.protection_status || domain.status || 'Unknown'), ...(domain.cloudflare_status ? { dnsStatus: safeText(domain.cloudflare_status) } : {}), ...(domain.connection_mode ? { connectionMode: safeText(domain.connection_mode) } : {}) };
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
  'effective_level',
  'under_attack',
  'auto_mode',
  'auto_baseline',
  'js_difficulty',
  'configured',
  'whitelistIps',
  'whitelistPaths',
  'whitelistAgents',
  'cookieTtlSec',
  'autoHotStreak',
  'autoEscalateProxied',
  'autoCoolDownSec',
  'banStrikes',
  'banTtlSec',
  'allowedMethods',
  'defaultMethods',
  'countryAllow',
  'countryBlock',
  'asnAllow',
  'asnBlock',
  'ips',
  'paths',
  'label',
  'summary',
  'period',
  'globalRequests',
  'apiRequests',
  'mitigationTimeout',
  'connectionMode',
  'appliedVia',
  'presets',
  'soft',
  'applies',
  'defaultOn',
  'softHardToggle',
  'profileId',
  'previousLevel',
  'revertAt',
  'hourStart',
  'hourEnd',
  'daysOfWeek',
  'origin_url',
  'originUrl',
  'tlsToOrigin',
  'source',
  'windowMinutes',
  'originErrors',
  'status5xx',
  'ttlSec',
  'maxMb',
  'extensions',
  'bypassPaths',
  'hits',
  'misses',
  'bypasses',
  'hitBytes',
  'entries',
  'bytesIn',
  'bytesOut',
  'bytes_in',
  'bytes_out',
  'scope',
  'match',
  'limit_mbps',
  'types',
  'site',
  'passed',
  'started_at',
  'ended_at',
  'duration_sec',
  'decision',
  'clientIp',
  'countryName',
  'asnOrg',
  'userAgent',
  'planCode',
  'statusReason',
  'planStartedAt',
  'domains',
  'dnsRecords',
  'bandwidthGb',
  'usedGb',
  'limitGb',
  'remainingGb',
  'percentUsed',
  'exceeded',
  'periodStart',
  'periodEnd',
  'dueDate',
  'day',
  'cleanBytes',
  'totalBytes',
  'cleanGb',
  'range',
  'rangeStart',
  'rangeEnd',
  'rangeUsedGb',
  'selectedDomainId',
  'bucketMinutes',
  'at',
  'domainId',
  'hosts',
  'challenges',
  'rate_limited',
  'url',
  'emailEnabled',
  'emailEvents',
  'bccEmails',
  'revoked_at',
  'page',
  'pageSize',
  'total',
  'totalPages',
  'sort',
  'rateLimitRps',
  'rateLimitBurst',
  'passedToOrigin',
  'errors',
  'bucketStart',
  'kind',
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
  'config',
  'available',
  'origin',
  'recent',
  'stats',
  'rules',
  'pathRules',
  'methodRules',
  'detail',
  'top_urls',
  'options',
  'defaults',
  'vps',
]);

function safeText(value: string): string {
  return value.replace(/\bBearer\s+\S+|\bcitadel_[a-z]_\S+/gi, '[redacted]').slice(0, 500);
}
function safeValue(key: string, value: string): string {
  if (['path', 'url', 'origin_url', 'originUrl'].includes(key)) {
    const withoutQuery = value.split(/[?#]/)[0]!;
    return safeText(withoutQuery.replace(/(https?:\/\/)[^/@]+@/gi, '$1[redacted]@'));
  }
  return safeText(value);
}
const settingsKeys: Record<string, string[]> = {
  'challenge': ['level', 'auto_baseline', 'js_difficulty'],
  'policy': ['whitelistIps', 'whitelistPaths', 'whitelistAgents', 'cookieTtlSec', 'autoHotStreak', 'autoEscalateProxied', 'autoCoolDownSec', 'banStrikes', 'banTtlSec', 'pathRules', 'countryAllow', 'countryBlock', 'asnAllow', 'asnBlock', 'allowedMethods', 'methodRules'],
  'lockdown': ['ips', 'paths', 'reason'],
  'rate-limit': ['preset', 'presets'],
  'blocklists': ['presets', 'soft', 'available'],
  'incident': ['active', 'profileId', 'previousLevel', 'revertAt'],
  'schedules': ['schedules'],
  'origin': ['origins'],
  'cache': ['enabled', 'ttlSec', 'maxMb', 'extensions', 'bypassPaths', 'availableExtensions'],
  'bandwidth-limits': ['rules'],
  'branding': ['types', 'shells'],
  'notifications/settings': ['emailEnabled', 'emailEvents', 'bccEmails', 'options'],
  'webhooks': ['webhooks'],
  'api-keys': ['keys'],
  'analytics/live': ['at', 'requests', 'challenges', 'passed', 'blocked', 'proxied', 'rate_limited', 'bytes_in', 'bytes_out', 'under_attack'],
  'logs': ['page', 'totalPages'],
  'events': ['page', 'totalPages'],
  'analytics': ['points'],
  'service/bandwidth': ['series'],
};
function editorData(data: unknown, resource: string): Record<string, JsonValue> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }
  function pick(value: unknown, key: string, depth = 0): JsonValue | undefined {
    if (depth > 5) {
      return undefined;
    }
    if (typeof value === 'string') {
      if (key === 'id' && !z.uuid().safeParse(value).success && !/^[\w-]{1,80}$/.test(value)) {
        return undefined;
      }
      return safeValue(key, value);
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === 'boolean' || value === null) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.slice(0, key === 'points' ? 1000 : 100).map(item => pick(item, key, depth + 1)).filter(item => item !== undefined);
    }
    if (value && typeof value === 'object') {
      const result: Record<string, JsonValue> = {};
      for (const [childKey, child] of Object.entries(value)) {
        if (displayKeys.has(childKey) || containerKeys.has(childKey) || childKey === 'id' || childKey === 'availableExtensions') {
          const selected = pick(child, childKey, depth + 1);
          if (selected !== undefined) {
            result[childKey] = selected;
          }
        }
      }
      return result;
    }
    return undefined;
  }
  const result: Record<string, JsonValue> = {};
  for (const key of settingsKeys[resource] || []) {
    const value = (data as Record<string, unknown>)[key];
    if (resource === 'branding' && key === 'shells' && value && typeof value === 'object') {
      const shells: Record<string, JsonValue> = {};
      for (const type of ['js', 'interact', 'lockdown', 'error_blocked', 'error_ratelimit', 'error_origin']) {
        const html = (value as Record<string, unknown>)[type];
        if (typeof html === 'string' && !/\bBearer\s+\S+|\bcitadel_[a-z]_\S+/i.test(html)) {
          shells[type] = html.slice(0, 40000);
        }
      }
      result.shells = shells;
    } else {
      const selected = pick(['webhooks', 'api-keys'].includes(resource) && Array.isArray(value) ? value.map(item => item && typeof item === 'object' ? Object.fromEntries(['id', 'name', 'kind', 'enabled', 'scopes', 'created_at', 'revoked_at'].filter(prop => prop in item).map(prop => [prop, item[prop]])) : item) : resource === 'origin' && key === 'origins' && Array.isArray(value) ? value.map(item => item && typeof item === 'object' ? { ...item, originUrl: item.origin_url ?? item.originUrl } : item) : value, key);
      if (selected !== undefined) {
        result[key] = selected;
      }
    }
  }
  return result;
}

function labelFor(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function redactCredential(value: unknown, credential: string, depth = 0): unknown {
  if (depth > 20) {
    return null;
  }
  if (typeof value === 'string') {
    return value.split(credential).join('[redacted]');
  }
  if (Array.isArray(value)) {
    return value.map(item => redactCredential(item, credential, depth + 1));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, redactCredential(child, credential, depth + 1)]));
  }
  return value;
}

export function projectResource(data: unknown, resource = '', credential?: string): ResourceView {
  // Even an unexpected credential echo in a known text field cannot cross the server boundary.
  if (credential) {
    data = redactCredential(data, credential);
  }
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
      if (resource === 'webhooks' && key === 'url') {
        continue;
      }
      const label = prefix ? `${prefix} · ${labelFor(key)}` : labelFor(key);
      if (displayKeys.has(key)) {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
          // Log paths can contain credentials in the query string. Omit that entire suffix.
          const text = typeof child === 'boolean' ? (child ? 'On' : 'Off') : String(child);
          target.push({ label, value: safeValue(key, text) });
        } else if (Array.isArray(child) && child.every(item => typeof item === 'string' || typeof item === 'number')) {
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
  return { fields, rows, data: editorData(data, resource) };
}
