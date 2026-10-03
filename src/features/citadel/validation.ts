import { isIP } from 'node:net';
import { z } from 'zod';
import { CitadelError } from './upstream';
import 'server-only';

const text = z.string().trim().max(500).refine(value => !Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127));
const hostname = z.string().trim().toLowerCase().max(253).regex(/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/);
const originHost = z.string().trim().max(253).refine(value => isIP(value) !== 0 || hostname.safeParse(value).success);
const ipCidr = text.refine((value) => {
  const [ip, prefix, extra] = value.split('/');
  const version = isIP(ip || '');
  return !!version && !extra && (prefix === undefined || (/^\d{1,3}$/.test(prefix) && Number(prefix) <= (version === 4 ? 32 : 128)));
});
const path = z.string().trim().max(500).startsWith('/').refine(value => !/[\r\n?#]/.test(value));
const list = (schema: z.ZodType = text, max = 100) => z.array(schema).max(max);
const seconds = (min: number, max = 86400) => z.number().int().min(min).max(max);
const level = z.enum(['auto', 'off', 'cookie', 'js', 'interact', 'lockdown']);
const ruleLevel = z.enum(['bypass', 'off', 'cookie', 'js', 'interact', 'lockdown']);
const method = z.enum(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
const profile = z.enum(['under_attack', 'strict', 'balanced', 'api_friendly']);
const pageType = z.enum(['js', 'interact', 'lockdown', 'error_blocked', 'error_ratelimit', 'error_origin']);
const originUrl = z.string().max(500).refine((value) => {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash
      && url.pathname === '/' && !!url.hostname;
  } catch {
    return false;
  }
});
const methodRule = z.object({ method, level: ruleLevel.optional(), rateLimitRps: z.number().positive().max(100000).optional(), rateLimitBurst: z.number().positive().max(100000).optional() }).strict();
const policy = z.object({
  whitelistIps: list(ipCidr),
  whitelistPaths: list(path),
  whitelistAgents: list(text),
  cookieTtlSec: seconds(60),
  autoHotStreak: seconds(1, 20),
  autoEscalateProxied: seconds(1, 10000),
  autoCoolDownSec: seconds(30),
  banStrikes: seconds(1, 100),
  banTtlSec: seconds(60),
  pathRules: list(z.object({ path, level: ruleLevel }).strict()).optional(),
  countryAllow: list(z.string().regex(/^[A-Z]{2}$/)).optional(),
  countryBlock: list(z.string().regex(/^[A-Z]{2}$/)).optional(),
  asnAllow: list(z.number().int().positive().max(4294967295)).optional(),
  asnBlock: list(z.number().int().positive().max(4294967295)).optional(),
  allowedMethods: list(method, 7).optional(),
  methodRules: list(methodRule, 7).optional(),
}).strict();
const speedRule = z.object({ scope: z.enum(['extension', 'path', 'subdomain', 'domain']), match: text, limit_mbps: z.number().min(0.1).max(1000), mode: z.enum(['connection', 'total']) }).strict().superRefine((rule, ctx) => {
  const valid = rule.scope === 'domain' ? rule.match === '' : rule.scope === 'path' ? path.safeParse(rule.match).success : rule.scope === 'extension' ? /^\.[a-z0-9]{1,20}$/i.test(rule.match) : hostname.safeParse(rule.match).success;
  if (!valid) {
    ctx.addIssue({ code: 'custom', message: 'Invalid speed rule match.' });
  }
});
const scheduleFields = { name: text.min(1), profileId: profile, hourStart: seconds(0, 23), hourEnd: seconds(1, 24), daysOfWeek: list(z.number().int().min(0).max(6), 7).min(1), timezone: text.refine((value) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).resolvedOptions();
    return true;
  } catch {
    return false;
  }
}), enabled: z.boolean() };

// Request shapes were read from the current Citadel customer portal, alongside its v1 OpenAPI.
// Only the user-scoped API is callable. Auth, platform, fleet ban/unlock and key creation are absent.
export const mutationSchemas: Record<string, z.ZodType> = {
  'POST domains': z.object({ domain: hostname, originHost, originPort: seconds(1, 65535), originTls: z.boolean() }).strict(),
  'POST origin': z.object({ origins: list(z.object({ hostname, originUrl, enabled: z.boolean() }).strict(), 50).min(1).refine(rows => rows.some(row => (row as { enabled: boolean }).enabled)) }).strict(),
  'DELETE origin': z.object({ hostname }).strict(),
  'POST origin-check': z.object({ hostname }).strict(),
  'PATCH challenge': z.object({ level, js_difficulty: z.literal('normal').optional(), auto_baseline: z.enum(['cookie', 'js']).optional() }).strict(),
  'PATCH policy': policy,
  'PATCH lockdown': z.object({ ips: list(ipCidr), paths: list(path), reason: text }).strict(),
  'PATCH rate-limit': z.object({ preset: text.min(1) }).strict(),
  'PATCH blocklists': z.object({ presets: list(text), soft: list(text) }).strict(),
  'POST incident': z.object({ minutes: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(120), z.literal(240)]), profileId: profile }).strict(),
  'POST schedules': z.object(scheduleFields).strict(),
  'PATCH schedules': z.union([z.object({ id: z.uuid(), ...scheduleFields }).strict(), z.object({ id: z.uuid(), enabled: z.boolean() }).strict()]),
  'PATCH cache': z.object({ enabled: z.boolean(), ttlSec: seconds(1, 604800), maxMb: seconds(1, 10000), extensions: list(z.string().regex(/^\.?[a-z0-9]{1,20}$/i)), bypassPaths: list(path) }).strict(),
  'POST cache': z.object({ path: path.optional() }).strict(),
  'PATCH bandwidth-limits': z.object({ rules: list(speedRule, 4).refine(rows => new Set(rows.map(row => (row as { scope: string }).scope)).size === rows.length) }).strict(),
  'PUT branding': z.object({ pageType, html: z.string().max(40000).refine(value => !/\bBearer\s+\S+|\bcitadel_[a-z]_\S+/i.test(value)) }).strict(),
  'POST webhooks': z.object({ name: text.min(1), kind: z.enum(['slack', 'discord', 'generic']), url: z.url().max(2000).refine((value) => {
    const url = new URL(value);
    const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash && hostname.safeParse(host).success
      && !host.endsWith('.local') && host !== 'localhost';
  }) }).strict(),
  'PATCH notifications/settings': z.object({ emailEnabled: z.boolean(), emailEvents: list(text), bccEmails: list(z.email(), 20) }).strict(),
};

export async function readMutationBody(request: Request, key: string): Promise<Record<string, unknown>> {
  const schema = mutationSchemas[key];
  if (!schema || !request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new CitadelError(400, 'This action requires a supported JSON request.');
  }
  const reader = request.body?.getReader();
  if (!reader) {
    throw new CitadelError(400, 'Complete the required settings.');
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      size += value.length;
      if (size > 64 * 1024) {
        await reader.cancel();
        throw new Error('too large');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const parsed = schema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
    if (!parsed.success) {
      throw new Error('invalid');
    }
    return parsed.data as Record<string, unknown>;
  } catch {
    throw new CitadelError(400, 'Check the settings and try again.');
  } finally {
    reader.releaseLock();
  }
}

export function validateQuery(resource: string, methodName: string, supplied: URLSearchParams): URLSearchParams {
  const integer = z.string().regex(/^[1-9]\d{0,5}$/);
  const readFields: Record<string, Record<string, z.ZodType>> = {
    'analytics': { minutes: z.enum(['15', '30', '60', '180', '360', '720', '1440', '4320', '10080']), domainId: z.uuid() },
    'analytics/live': { domainId: z.uuid() },
    'service/bandwidth': { range: z.enum(['billing', '30', '60', '90']) },
    'events': { page: integer, pageSize: z.string().regex(/^(?:[1-9]|[1-4]\d|50)$/) },
    'logs': { page: integer, pageSize: z.string().regex(/^(?:[1-9]|[1-4]\d|50)$/), sort: z.enum(['desc', 'asc']), type: z.enum(['access', 'security', 'error']), method, status: z.string().regex(/^[1-5]\d{2}$/), search: z.string().trim().max(200) },
  };
  const deleteFields: Record<string, Record<string, z.ZodType>> = { 'schedules': { id: z.uuid() }, 'branding': { type: pageType }, 'webhooks': { id: z.uuid() }, 'api-keys': { id: z.uuid() } };
  const allowed = (methodName === 'GET' ? readFields : methodName === 'DELETE' ? deleteFields : {})[resource] || {};
  const query = new URLSearchParams();
  for (const [key, value] of supplied) {
    const parsed = allowed[key]?.safeParse(value);
    if (query.has(key) || !parsed?.success) {
      throw new CitadelError(400, 'Unsupported filter.');
    }
    query.set(key, String(parsed.data));
  }
  if (methodName === 'DELETE' && ['schedules', 'webhooks', 'api-keys'].includes(resource) && !query.has('id')) {
    throw new CitadelError(400, 'Choose a schedule.');
  }
  return query;
}
