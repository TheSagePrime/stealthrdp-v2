import { Activity, ArrowRight, BookOpen, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const resources = [
  {
    label: 'Documentation',
    text: 'Setup guides, server tasks and product documentation.',
    href: '/docs',
    icon: BookOpen,
  },
  {
    label: 'Tutorials',
    text: 'Practical VPS guides and technical articles.',
    href: '/blog',
    icon: FileText,
  },
  {
    label: 'FAQ',
    text: 'Quick answers about plans, setup, billing and service.',
    href: '/faq',
    icon: HelpCircle,
  },
  {
    label: 'Server status',
    text: 'Check current public infrastructure health.',
    href: '/status',
    icon: Activity,
  },
] as const;

export function Resources() {
  return (
    <section className="sr-section srv3-resources-section" id="resources">
      <div className="sr-container">
        <div className="srv3-section-heading">
          <div>
            <p className="sr-kicker">Need more detail?</p>
            <h2>Everything useful stays close to the product.</h2>
          </div>
        </div>

        <div className="srv3-resource-grid">
          {resources.map(({ label, text, href, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon aria-hidden="true" />
              <div>
                <h3>{label}</h3>
                <p>{text}</p>
              </div>
              <ArrowRight className="srv3-resource-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
