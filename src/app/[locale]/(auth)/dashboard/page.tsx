import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PageMessage } from '@/features/dashboard/PageMessage';
import { TitleBar } from '@/features/dashboard/TitleBar';

type DashboardIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardIndexPage(props: DashboardIndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardIndexPage',
  });

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />
      <PageMessage
        icon={(
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3M12 12l8-4.5M12 12v9M12 12L4 7.5" />
          </svg>
        )}
        title={t('message_state_title')}
        description={t('message_state_description')}
        button={(
          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <p>{t('message_state_alternative')}</p>
            <p>{t('max_message')}</p>
            <Link
              className="
                inline-flex rounded-md bg-primary px-4 py-2
                text-primary-foreground
              "
              href="/api/health"
            >
              Check runtime
            </Link>
          </div>
        )}
      />
    </>
  );
}
