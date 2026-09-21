const entries = [
  { id: 'after-checkout', label: 'The part that matters after checkout.' },
  { id: 'locations', label: 'Put the server closer to the work.' },
  { id: 'infrastructure', label: 'Built for the workload, not the brochure.' },
  { id: 'plans', label: 'Plans priced for the work' },
] as const;

/**
 * Section index. DESIGN.md section 9, position 2: the page becomes an indexed
 * document. Labels are the page's own headings, so no new words enter the copy.
 */
export function SectionIndex() {
  return (
    <nav className="sr-index" aria-label="Sections">
      <div className="sr-container">
        <ol className="sr-index-list">
          {entries.map((entry, index) => (
            <li className="sr-index-item" key={entry.id}>
              <a href={`#${entry.id}`}>
                <span className="sr-index-num">{`0${index + 1}`}</span>
                <span className="sr-index-label">{entry.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
