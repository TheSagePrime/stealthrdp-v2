import { getHealthResponse } from '@/features/runtime/health';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getHealthResponse(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
