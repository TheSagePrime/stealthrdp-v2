import { z } from 'zod';
import { accountResources, domainResources } from './catalog';
import { authorize, checkOrganisation, errorResponse, privateJson } from './http';
import { projectDomains, projectResource } from './projection';
import { CitadelError, citadelRequest } from './upstream';
import { mutationSchemas, readMutationBody, validateQuery } from './validation';
import 'server-only';

type Operation = { path: string; resource: string; domainId?: string; domains?: boolean; bodyKey?: string };
export function resolveOperation(segments: string[], method: string, withBody = false): Operation {
  const path = segments.join('/');
  if (method === 'GET' && accountResources.some(resource => resource.path === path)) {
    return { path: `/api/v1/${path}`, resource: path };
  }
  if (path === 'domains' && method === 'GET') {
    return { path: '/api/v1/domains', resource: path, domains: true };
  }
  if (withBody && (path === 'domains' || ['notifications/settings', 'webhooks'].includes(path)) && mutationSchemas[`${method} ${path}`]) {
    return { path: `/api/v1/${path}`, resource: path, bodyKey: `${method} ${path}` };
  }
  if (method === 'DELETE' && ['webhooks', 'api-keys'].includes(path)) {
    return { path: `/api/v1/${path}`, resource: path };
  }
  const [root, id, resource = 'domains'] = segments;
  if (root !== 'domains' || !z.uuid().safeParse(id).success) {
    throw new CitadelError(404, 'This Citadel operation is not available.');
  }
  const bodyKey = `${method} ${resource}`;
  const readable = segments.length === 3 && method === 'GET' && domainResources.some(item => item.path === resource);
  const actionable = segments.length === 3 && method === 'POST' && ['refresh', 'restore-defaults', 'protection'].includes(resource);
  const removable = method === 'DELETE' && (segments.length === 2 || (segments.length === 3 && ['incident', 'schedules', 'branding'].includes(resource)));
  const editable = segments.length === 3 && withBody && !!mutationSchemas[bodyKey];
  if (!readable && !actionable && !removable && !editable) {
    throw new CitadelError(405, 'This Citadel operation is not available.');
  }
  return { path: `/api/v1/${path}`, resource, domainId: id, ...(editable ? { bodyKey } : {}) };
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CitadelError(502, 'Citadel returned unsupported settings.');
  }
  return value as Record<string, unknown>;
}
function collection(value: unknown, key: string): Record<string, unknown>[] {
  const rows = record(value)[key];
  if (!Array.isArray(rows) || rows.length > 500) {
    throw new CitadelError(502, 'Citadel returned unsupported settings.');
  }
  return rows.map(record);
}
function availableSelection(body: Record<string, unknown>, key: string, current: unknown, optionsKey: string, optionId = 'id'): void {
  const values = body[key];
  if (!Array.isArray(values)) {
    return;
  }
  const options = record(current)[optionsKey];
  if (!Array.isArray(options) || !values.every(value => options.some(option => typeof option === 'string' ? value === option : record(option)[optionId] === value))) {
    throw new CitadelError(400, 'Select one of the available options.');
  }
}

export async function handleOperation(request: Request, organisation: string, segments: string[]): Promise<Response> {
  try {
    const mutation = request.method !== 'GET';
    const { session, principal } = await authorize(request, mutation);
    checkOrganisation(principal, organisation);
    const operation = resolveOperation(segments, request.method, request.body !== null);
    const query = validateQuery(operation.resource, request.method, new URL(request.url).searchParams);
    if (mutation && principal.role === 'member') {
      throw new CitadelError(403, 'An organisation owner or admin must perform this action.');
    }
    if (!operation.bodyKey && request.body !== null) {
      throw new CitadelError(400, 'This operation does not accept a request body.');
    }
    const body = operation.bodyKey ? await readMutationBody(request, operation.bodyKey) : undefined;
    let domainName = '';
    if (operation.domainId || operation.domains || query.has('domainId')) {
      const domains = projectDomains(await citadelRequest(session.bearer, '/api/v1/domains'), organisation);
      if (operation.domains) {
        return privateJson({ domains });
      }
      const domain = domains.find(item => item.id === (operation.domainId || query.get('domainId')));
      if (!domain) {
        throw new CitadelError(404, 'This domain is not available to your account.');
      }
      domainName = domain.name;
    }
    if (body && operation.resource === 'origin') {
      const hosts = body.origins ? (body.origins as { hostname: string }[]).map(item => item.hostname) : [String(body.hostname)];
      if (new Set(hosts).size !== hosts.length || !hosts.every(host => host === domainName || host.endsWith(`.${domainName}`))) {
        throw new CitadelError(400, 'Origin hostnames must belong to this domain.');
      }
      if (request.method === 'DELETE' && hosts[0] === domainName) {
        throw new CitadelError(400, 'The main origin cannot be removed.');
      }
    }
    if (body && operation.resource === 'bandwidth-limits') {
      for (const rule of body.rules as { scope: string; match: string }[]) {
        if (rule.scope === 'subdomain' && !(rule.match === domainName || rule.match.endsWith(`.${domainName}`))) {
          throw new CitadelError(400, 'Choose a subdomain of this domain.');
        }
      }
    }
    if (request.method === 'DELETE' && ['webhooks', 'api-keys'].includes(operation.resource)) {
      const rows = collection(await citadelRequest(session.bearer, operation.path), operation.resource === 'webhooks' ? 'webhooks' : 'keys');
      if (!rows.some(item => item.id === query.get('id'))) {
        throw new CitadelError(404, 'This item is not available to your account.');
      }
    }
    if (operation.resource === 'schedules' && ['PATCH', 'DELETE'].includes(request.method)) {
      const id = body?.id || query.get('id');
      const schedules = collection(await citadelRequest(session.bearer, operation.path), 'schedules');
      if (!schedules.some(item => item.id === id)) {
        throw new CitadelError(404, 'This schedule is not available to your account.');
      }
    }
    if (body && operation.resource === 'origin-check') {
      const origins = collection(await citadelRequest(session.bearer, `/api/v1/domains/${operation.domainId}/origin`), 'origins');
      if (!origins.some(item => item.hostname === body.hostname && item.enabled === true)) {
        throw new CitadelError(400, 'Choose an enabled saved origin.');
      }
    }
    if (body && ['rate-limit', 'blocklists', 'cache', 'notifications/settings'].includes(operation.resource)) {
      const current = await citadelRequest(session.bearer, operation.path);
      if (operation.resource === 'rate-limit') {
        availableSelection({ presets: [body.preset] }, 'presets', current, 'presets');
      }
      if (operation.resource === 'blocklists') {
        availableSelection(body, 'presets', current, 'available');
        const presets = body.presets as string[];
        const options = collection(current, 'available');
        if (!(body.soft as string[]).every(id => presets.includes(id) && options.some(option => option.id === id && option.softHardToggle === true))) {
          throw new CitadelError(400, 'Soft mode must use an enabled supported blocklist.');
        }
      }
      if (operation.resource === 'cache') {
        availableSelection(body, 'extensions', current, 'availableExtensions');
      }
      if (operation.resource === 'notifications/settings') {
        availableSelection(body, 'emailEvents', current, 'options');
      }
    }
    if (body && operation.resource === 'policy') {
      // Server-owned update flags prevent unrelated browser flags from changing policy semantics.
      if (body.pathRules !== undefined) {
        body.updateRules = true;
      }
      if (body.countryAllow !== undefined || body.countryBlock !== undefined || body.asnAllow !== undefined || body.asnBlock !== undefined) {
        body.updateGeo = true;
      }
      if (body.allowedMethods !== undefined || body.methodRules !== undefined) {
        body.updateMethods = true;
      }
    }
    const result = await citadelRequest(session.bearer, operation.path, request.method, body, query);
    return privateJson(mutation ? { ok: true, ...projectResource(result, operation.resource, session.bearer) } : projectResource(result, operation.resource, session.bearer));
  } catch (error) {
    return errorResponse(error);
  }
}
