// Adapted from Dashboardblocks Page Header (MIT). See THIRD_PARTY_NOTICES.md.
import type { ReactNode } from 'react';
import { cn } from '@/utils/Helpers';

/** The top of a page: put a back link, the heading, actions, meta and tabs in it. */
function PageHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('@container/page-header flex flex-col gap-4', className)}>
      {children}
    </div>
  );
}

/** The heading beside its actions on wide headers, above them on narrow ones. */
function PageHeaderRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `
          flex flex-col gap-4
          @2xl/page-header:flex-row @2xl/page-header:items-start
          @2xl/page-header:justify-between
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}

type PageHeaderHeadingProps = {
  /** Beside the title, such as a status badge or a count. */
  badge?: ReactNode;
  className?: string;
  description?: ReactNode;
  /** Before the title, such as an avatar or a logo tile. */
  media?: ReactNode;
  title: ReactNode;
  /**
   * Lets a long title wrap onto more lines, such as a record's name, where
   * cutting it short would hide what the page is about.
   * @default false
   */
  wrap?: boolean;
};

/** The page's title as its <div>, with an optional badge, media and description. */
function PageHeaderHeading({
  badge,
  className,
  description,
  media,
  title,
  wrap = false,
}: PageHeaderHeadingProps) {
  return (
    <div className={cn('flex min-w-0 items-start gap-3', className)}>
      {media}
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div
            className={cn(
              'text-2xl font-semibold tracking-tight',
              wrap ? 'text-balance wrap-break-word' : 'truncate',
            )}
          >
            {title}
          </div>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export { PageHeader, PageHeaderHeading, PageHeaderRow };
