/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { TOCItemType } from 'fumadocs-core/toc';
import type { ReactNode } from 'react';
import type { DocsLink } from '@/components/site/docs/DocsParts';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import Link from 'next/link';
import { DocsRelated } from '@/components/site/docs/DocsParts';
import { GuideToc } from '@/components/site/guides/GuideToc';

/* A long-form guide: one centred reading column with Fumadocs typography, the table of contents
   beside it on wide screens and folded above the text on small ones. No docs sidebar: a guide is
   read top to bottom, not browsed. */
export function GuideArticle({
  section,
  title,
  description,
  meta,
  toc,
  children,
  related,
  relatedHeading,
  after,
}: {
  section: { label: string; href: string };
  title: string;
  description: string;
  meta: ReactNode;
  toc: TOCItemType[];
  children: ReactNode;
  related: DocsLink[];
  relatedHeading: string;
  after?: ReactNode;
}) {
  return (
    <div className="
      sr-container py-10
      lg:py-14
    "
    >
      <div className="
        grid gap-16
        lg:grid-cols-[minmax(0,46rem)_14rem] lg:justify-center
      "
      >
        <article className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="
              mb-5 flex items-center gap-1.5 text-sm text-fd-muted-foreground
            "
          >
            <Link href={section.href} className="hover:text-fd-foreground">{section.label}</Link>
            <CaretRight aria-hidden="true" className="size-3.5" />
            <span className="truncate text-fd-foreground">{title}</span>
          </nav>
          <h1 className="
            text-3xl font-semibold tracking-tight text-balance
            sm:text-4xl
          "
          >
            {title}
          </h1>
          <p className="mt-4 text-lg text-fd-muted-foreground">{description}</p>
          <div className="
            sr-guide-meta mt-6 flex flex-wrap items-center gap-x-5 gap-y-1
            border-y py-3 text-sm text-fd-muted-foreground
          "
          >
            {meta}
          </div>
          {toc.length > 0
            ? (
                <InlineTOC
                  items={toc}
                  className="
                    mt-8
                    lg:hidden
                  "
                />
              )
            : null}
          <div className="prose mt-8 min-w-0">{children}</div>
          {after}
          <DocsRelated heading={relatedHeading} items={related} />
        </article>
        {toc.length > 0
          ? (
              <aside className="
                hidden
                lg:block
              "
              >
                <GuideToc items={toc} label="On this page" />
              </aside>
            )
          : null}
      </div>
    </div>
  );
}
