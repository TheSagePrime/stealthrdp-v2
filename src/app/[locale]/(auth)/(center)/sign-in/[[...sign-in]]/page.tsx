import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createPageMetadata } from '@/libs/seo/metadata';
import { getI18nPath } from '@/utils/Helpers';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: SignInPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });

  return createPageMetadata({
    path: '/sign-in',
    title: t('meta_title'),
    description: t('meta_description'),
    locale,
  });
}

export default async function SignInPage(props: SignInPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <SignIn path={getI18nPath('/sign-in', locale)} />
  );
};
