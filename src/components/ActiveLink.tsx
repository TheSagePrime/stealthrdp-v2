'use client';

import { Link, usePathname } from '@/libs/I18nNavigation';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/utils/Helpers';

export const ActiveLink = (props: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(props.href);

  return (
    <Link
      href={props.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'sm' }))}
    >
      {props.children}
    </Link>
  );
};
