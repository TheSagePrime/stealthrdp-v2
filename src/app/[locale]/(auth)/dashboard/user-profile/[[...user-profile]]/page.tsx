import { UserProfile } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getI18nPath } from '@/utils/Helpers';
import { auth } from '@clerk/nextjs/server';

export default async function UserProfilePage(props: {
  params: Promise<{ locale: string }>;
}) {
  await auth.protect();
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'UserProfilePage',
  });

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <UserProfile
        routing="path"
        path={getI18nPath('/dashboard/user-profile', locale)}
        appearance={{
          elements: {
            rootBox: 'w-full',
            cardBox: 'w-full',
          },
        }}
      />
    </>
  );
};
