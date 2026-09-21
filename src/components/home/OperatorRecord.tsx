import { testimonials, type Testimonial } from '@/lib/stealth/content';

function sourceLine(item: Testimonial): string {
  const parts = [item.authorPosition, item.authorCompany].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return item.publishedOn ?? 'StealthRDP customer';
}

/**
 * The record: published customer feedback, quoted, with its source and date where one exists.
 * One statement at reading size, the rest as ruled rows.
 */
export function OperatorRecord() {
  const [featured, ...rest] = testimonials;
  const rows = rest.slice(0, 6);

  if (!featured) return null;

  return (
    <div className="srx-record">
      <figure className="srx-record-featured">
        <blockquote>{featured.quote}</blockquote>
        <figcaption className="srx-mono">
          {featured.authorName}
          <span> · {sourceLine(featured)}</span>
        </figcaption>
      </figure>

      {rows.length > 0 ? (
        <ul className="srx-record-rows">
          {rows.map((item, index) => (
            <li key={item.id ?? item._id ?? index}>
              <p className="srx-record-quote">{item.quote}</p>
              <p className="srx-record-meta srx-mono">
                <span>{item.authorName}</span>
                {item.publishedOn ? <span> · {item.publishedOn}</span> : null}
                {item.sourceUrl ? (
                  <>
                    {' · '}
                    <a href={item.sourceUrl} rel="noreferrer nofollow" target="_blank">
                      {item.sourceLabel ?? 'Source'}
                    </a>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
