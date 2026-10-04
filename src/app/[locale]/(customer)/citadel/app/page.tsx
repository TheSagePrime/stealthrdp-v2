import type { Metadata } from 'next';
import { CitadelDashboard } from '@/features/citadel/CitadelDashboard';

export const metadata: Metadata = {
  title: 'Citadel Dashboard | StealthRDP',
  description: 'Manage your Citadel domains, inspect Layer 7 protection settings and review website traffic.',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The sign-in callback returns here with one public failure code. It is read on the
 * server so the notice renders without JavaScript; no credential ever reaches this page.
 */
export default async function CitadelAppPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const failureCode = typeof params.citadel_error === 'string' ? params.citadel_error : '';

  return <CitadelDashboard failureCode={failureCode} />;
}
