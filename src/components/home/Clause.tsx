/**
 * A clause of the manifest: a numbered gutter against a content column.
 * This replaces the centred section header the rest of the site uses.
 */
export function Clause({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const titleId = `srx-clause-${index}`;

  return (
    <section className="srx-clause" aria-labelledby={titleId}>
      <div className="srx-clause-gutter">
        <span className="srx-clause-index srx-mono">{index}</span>
        <span className="srx-clause-label srx-mono">{label}</span>
      </div>
      <div className="srx-clause-body">
        <h2 className="srx-clause-title" id={titleId}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
