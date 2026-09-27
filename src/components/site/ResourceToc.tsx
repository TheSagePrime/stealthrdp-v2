export type ResourceHeading = {
  id: string;
  text: string;
  level?: 2 | 3;
};

export function ResourceToc({
  headings,
  title = 'On this page',
}: {
  headings: ResourceHeading[];
  title?: string;
}) {
  if (headings.length === 0) return null;

  return (
    <aside className="srv-resource-toc" aria-label={title}>
      <span className="srv-resource-nav-label">{title}</span>
      <ol>
        {headings.map(heading => (
          <li key={heading.id} data-level={heading.level ?? 2}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
