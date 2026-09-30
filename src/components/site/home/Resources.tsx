import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const resources = [
  {
    label: 'Documentation',
    text: 'Setup guides, server tasks and product documentation.',
    href: '/docs',
  },
  {
    label: 'Tutorials',
    text: 'Practical VPS guides and technical articles.',
    href: '/blog',
  },
  {
    label: 'FAQ',
    text: 'Quick answers about plans, setup, billing and service.',
    href: '/faq',
  },
  {
    label: 'Server status',
    text: 'Check current public infrastructure health.',
    href: '/status',
  },
] as const;

export function Resources() {
  return (
    <section className="sr-section srv3-resources-section" id="resources">
      <div className="sr-container">
        <div className="srv3-resources-head">
          <div>
            <p className="sr-kicker">Need more detail?</p>
            <h2>Docs, answers, and live status.</h2>
          </div>
          <p>Everything important stays one click away without interrupting the buying flow.</p>
        </div>

        <Card className="srv3-resources-card">
          <CardContent className="p-0">
            <dl className="srv3-resource-links">
              {resources.map(({ label, text, href }) => (
                <div key={href} className="srv3-resource-item">
                  <dt>
                    <Link
                      href={href}
                      className="
                        inline-flex min-h-11 items-center gap-2 text-body
                        font-semibold text-body-text transition-colors
                        hover:text-primary
                      "
                    >
                      {label}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </dt>
                  <dd className="text-small text-body-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
