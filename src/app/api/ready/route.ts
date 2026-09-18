import { getReadinessResponse } from '@/features/runtime/readiness';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const response = await getReadinessResponse();
  return Response.json(response, {
    status: response.status === 'ready' ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
