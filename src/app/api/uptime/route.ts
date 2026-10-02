import { getUptimeReport } from '@/lib/stealth/uptime';

// Same data as /status. Rebuilt at most every 5 minutes, so visitors never spend the UptimeRobot rate limit.
export const revalidate = 300;

export async function GET() {
  return Response.json(await getUptimeReport());
}
