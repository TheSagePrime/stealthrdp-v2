'use client';

import { Globe } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { isSiteLocale } from '@/config/i18n';
import { usePathname, useRouter } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (newLocale: string) => {
    if (newLocale === locale || !isSiteLocale(newLocale)) {
      return;
    }

    const { search } = window.location;
    router.push(`${pathname}${search}`, { locale: newLocale, scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('button_label')}>
          <Globe size={24} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {AppConfig.i18n.locales.map(elt => (
            <DropdownMenuRadioItem key={elt.id} value={elt.id}>
              {elt.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
