'use client';

import type { ComponentProps } from 'react';
import { FrameworkProvider } from 'fumadocs-core/framework';
import { RootProvider } from 'fumadocs-ui/provider/base';
import Link from 'next/link';
import { usePathname as useNextPathname, useParams, useRouter } from 'next/navigation';
import { AppConfig } from '@/utils/AppConfig';

// The proxy rewrites /docs/x to /en/docs/x, so the server renders with the locale prefix
// while the browser has the clean path. That mismatch broke the docs sidebar hydration.
// Give the docs UI the clean path on both sides.
const localePrefix = new RegExp(`^/${AppConfig.i18n.defaultLocale}(?=/|$)`);

function usePathname(): string {
  return useNextPathname().replace(localePrefix, '') || '/';
}

function DocsLink({ href = '', ...props }: ComponentProps<'a'> & { prefetch?: boolean }) {
  return <Link href={href} {...props} />;
}

export function DocsRootProvider(props: ComponentProps<typeof RootProvider>) {
  return (
    <FrameworkProvider usePathname={usePathname} useRouter={useRouter} useParams={useParams} Link={DocsLink}>
      <RootProvider {...props} />
    </FrameworkProvider>
  );
}
