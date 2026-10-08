// Adapted from Dashboardblocks ChoiceCards in onboarding.json (MIT).
// Radio choices become navigation groups; icon tiles and content hierarchy retained.
// See THIRD_PARTY_NOTICES.md.
import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/Helpers';

type FooterNavigationProps = {
  label: string;
  options: { title: string; icon: ReactNode; links: [string, string][] }[];
};

export function FooterNavigation({ label, options }: FooterNavigationProps) {
  return (
    <nav
      aria-label={label}
      className="
        grid grid-cols-2 gap-x-8 gap-y-6
        md:grid-cols-4
      "
    >
      {options.map((option, index) => (
        <div
          key={option.title}
          className={cn('py-0', index === 1 && 'md:col-span-2', index === 2 && `
            col-span-2
            md:col-span-1
          `, index > 0 && `md:border-l md:border-border md:pl-8`)}
        >
          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="
                  flex size-5 shrink-0 items-center justify-center text-primary
                "
              >
                {option.icon}
              </span>
              <h2 className="text-xs font-semibold tracking-wider uppercase">{option.title}</h2>
            </div>
            <ul className={cn('w-full text-sm text-muted-foreground', index === 2 && `
              grid grid-cols-2
              md:block
            `, index === 1 && `sm:grid sm:grid-cols-2 sm:gap-x-4`)}
            >
              {option.links.map(([title, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="
                      flex min-h-11 items-center rounded-sm py-2
                      transition-colors
                      hover:text-primary hover:underline
                      hover:underline-offset-4
                      focus-visible:outline-2 focus-visible:outline-offset-2
                      focus-visible:outline-ring
                    "
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </nav>
  );
}
