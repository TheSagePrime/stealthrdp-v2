import { getUptimeReport } from '@/lib/stealth/uptime';

// Same shared 60-second report as /status; avoid a second route cache hiding refreshed data.
export const revalidate = 0;

export async function GET() {
  return Response.json(await getUptimeReport());
}
