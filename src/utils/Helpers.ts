import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { routing } from '@/libs/I18nRouting';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getI18nPath = (url: string, locale: string) => {
  if (routing.localePrefix === 'never') {
    return url;
  }
  if (routing.localePrefix === 'as-needed' && locale === routing.defaultLocale) {
    return url;
  }
  return `/${locale}${url === '/' ? '' : url}`;
};
