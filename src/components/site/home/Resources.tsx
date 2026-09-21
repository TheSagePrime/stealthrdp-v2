import { Activity, BookOpen, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const resources = [
  { label: 'Documentation', href: '/docs', icon: BookOpen },
  { label: 'Tutorials', href: '/blog', icon: FileText },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Server status', href: '/status', icon: Activity },
] as const;

/**
 * Documentation and support entry points. DESIGN.md section 9, position 7.
 * The heading and labels reuse the footer's own wording.
 */
export function Resources() {
  return (
    <section className="sr-section sr-section-border" id="resources">
      <div className="sr-container">
        <div className="sr-section-head">
          <div>
            <h2 className="sr-section-title">Resources</h2>
          </div>
        </div>

        <ul className="sr-resources-list">
          {resources.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link href={href}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
