import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Env } from '@/libs/Env';
import { routing } from '@/libs/I18nRouting';
import { resolveSiteUrl } from '@/libs/seo/site-url';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (Env.NEXT_PUBLIC_APP_URL && !process.env.SITE_URL) {
    return Env.NEXT_PUBLIC_APP_URL;
  }

  return resolveSiteUrl().origin;
};

export const getI18nPath = (url: string, locale: string) => {
  if (routing.localePrefix === 'never') {
    return url;
  }
  if (routing.localePrefix === 'as-needed' && locale === routing.defaultLocale) {
    return url;
  }
  return `/${locale}${url === '/' ? '' : url}`;
};
