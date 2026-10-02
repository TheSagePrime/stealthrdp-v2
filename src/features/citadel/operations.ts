import { z } from 'zod';

import { accountResources, domainResources } from './catalog';
import { authorize, checkOrganisation, errorResponse, privateJson } from './http';
import { projectDomains, projectResource } from './projection';
import { CitadelError, citadelRequest } from './upstream';
import 'server-only';

export function resolveOperation(
  segments: string[],
  method: string,
): { path: string; domainId?: string; domains?: boolean } {
  const path = segments.join('/');
  if (method === 'GET' && accountResources.some(resource => resource.path === path)) {
    return { path: `/api/v1/${path}` };
  }
  if (path === 'domains' && method === 'GET') {
    return { path: '/api/v1/domains', domains: true };
  }
  const [root, id, resource] = segments;
  if (root !== 'domains' || !z.uuid().safeParse(id).success) {
    throw new CitadelError(404, 'This Citadel operation is not available.');
  }
  const readable = segments.length === 3 && method === 'GET' && domainResources.some(item => item.path === resource);
  const actionable
    = segments.length === 3
      && method === 'POST'
      && ['refresh', 'origin-check', 'restore-defaults'].includes(resource || '');
  const removable = segments.length === 2 && method === 'DELETE';
  if (!readable && !actionable && !removable) {
    throw new CitadelError(405, 'This Citadel operation is not available.');
  }
  return { path: `/api/v1/${path}`, domainId: id };
}

export async function handleOperation(request: Request, organisation: string, segments: string[]): Promise<Response> {
  try {
    const mutation = request.method !== 'GET';
    const { session, principal } = await authorize(request, mutation);
    checkOrganisation(principal, organisation);
    const operation = resolveOperation(segments, request.method);
    if (new URL(request.url).search || (mutation && request.body !== null)) {
      throw new CitadelError(400, 'This operation does not accept extra parameters.');
    }
    if (mutation && principal.role === 'member') {
      throw new CitadelError(403, 'An organisation owner or admin must perform this action.');
    }
    if (operation.domainId || operation.domains) {
      const domains = projectDomains(await citadelRequest(session.bearer, '/api/v1/domains'), organisation);
      if (operation.domains) {
        return privateJson({ domains });
      }
      if (!domains.some(domain => domain.id === operation.domainId)) {
        throw new CitadelError(404, 'This domain is not available to your account.');
      }
    }
    const result = await citadelRequest(session.bearer, operation.path, request.method);
    return privateJson(mutation ? { ok: true, ...projectResource(result) } : projectResource(result));
  } catch (error) {
    return errorResponse(error);
  }
}
