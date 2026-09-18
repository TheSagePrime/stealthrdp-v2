import 'server-only';

const sensitiveHeaders = {
  'Cache-Control': 'no-store, private',
  Pragma: 'no-cache',
} as const;

export function sensitiveJson(body: unknown, init: { status: number; headers?: HeadersInit }): Response {
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(sensitiveHeaders)) {
    headers.set(key, value);
  }

  return Response.json(body, {
    ...init,
    headers,
  });
}

export function sensitiveRedirect(location: string, status = 303): Response {
  const headers = new Headers(sensitiveHeaders);
  headers.set('Location', location);
  return new Response(null, { status, headers });
}
