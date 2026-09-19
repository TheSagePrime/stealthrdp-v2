import type { Metadata } from 'next';
import { OrganizationList } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createPageMetadata } from '@/libs/seo/metadata';
import { auth } from '@clerk/nextjs/server';

type OrganizationSelectionProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: OrganizationSelectionProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return createPageMetadata({
    path: '/onboarding',
    title: t('meta_title'),
    description: t('meta_description'),
    locale,
  });
}

export default async function OrganizationSelectionPage(props: OrganizationSelectionProps) {
  await auth.protect();
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <OrganizationList
        afterSelectOrganizationUrl="/dashboard"
        afterCreateOrganizationUrl="/dashboard"
        hidePersonal
        skipInvitationScreen
      />
    </div>
  );
}
