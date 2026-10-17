import type { SiteLocale } from '@/config/i18n';
import type { SiteCopy } from '@/content/i18n/site';
import { Navbar1 } from '@/components/shadcnblocks/navbar1';
import { siteCopy } from '@/content/i18n/site';

export function SiteHeader({ locale = 'en', copy = siteCopy.en }: { locale?: SiteLocale; copy?: SiteCopy }) {
  return <Navbar1 locale={locale} copy={copy} />;
}
