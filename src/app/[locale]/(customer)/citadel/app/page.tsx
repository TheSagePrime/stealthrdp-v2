import type { Metadata } from 'next';
import { CitadelDashboard } from '@/features/citadel/CitadelDashboard';

export const metadata: Metadata = {
  title: 'Citadel Dashboard | StealthRDP',
  description: 'Manage your Citadel domains, inspect Layer 7 protection settings and review website traffic.',
  robots: { index: false, follow: false, nocache: true },
};

export default function CitadelAppPage() {
  return <CitadelDashboard />;
}
