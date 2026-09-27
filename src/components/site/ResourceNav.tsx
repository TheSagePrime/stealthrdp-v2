import Link from 'next/link';

export type ResourceSection = 'resources' | 'guides' | 'help' | 'faq' | 'status';

const links: { label: string; href: string; key: ResourceSection; description: string }[] = [
  { label: 'Resources home', href: '/resources', key: 'resources', description: 'Search across help and guides' },
  { label: 'Guides', href: '/blog', key: 'guides', description: 'Use cases and infrastructure articles' },
  { label: 'Help Center', href: '/docs', key: 'help', description: 'Setup and troubleshooting' },
  { label: 'Common Questions', href: '/faq', key: 'faq', description: 'Quick answers before and after deploy' },
  { label: 'Service Status', href: '/status', key: 'status', description: 'Infrastructure availability' },
];

export function ResourceNav({ active }: { active: ResourceSection }) {
  return (
    <nav className="srv-resource-nav" aria-label="Resources navigation">
      <span className="srv-resource-nav-label">Resources</span>
      <ul>
        {links.map(item => (
          <li key={item.key}>
            <Link href={item.href} data-active={active === item.key}>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
