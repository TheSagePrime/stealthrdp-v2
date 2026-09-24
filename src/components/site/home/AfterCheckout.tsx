import { ArrowUpRight, Quote } from 'lucide-react';
import { testimonials } from '@/lib/stealth/content';

export function AfterCheckout() {
  return (
    <section className="sr-section srv3-reviews-section" id="reviews">
      <div className="sr-container">
        <div className="srv3-section-heading">
          <div>
            <p className="sr-kicker">Customer feedback</p>
            <h2>Proof should come from customers, not decoration.</h2>
          </div>
          <p>
            A selection of feedback already published by StealthRDP and its review sources.
          </p>
        </div>

        <div className="srv3-review-grid">
          {testimonials.slice(0, 3).map((item, index) => (
            <article className="srv3-review-card" key={item.id ?? item._id ?? index}>
              <div className="srv3-review-top">
                <span className="srv3-review-quote">
                  <Quote aria-hidden="true" />
                </span>
                <span className="srv3-review-source">
                  {item.sourceLabel || item.publishedOn || 'Customer feedback'}
                </span>
              </div>

              <blockquote>{item.quote}</blockquote>

              <footer>
                <div>
                  <strong>{item.authorName}</strong>
                  <span>{item.authorCompany || item.publishedOn || 'StealthRDP customer'}</span>
                </div>
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View source for review by ${item.authorName}`}
                  >
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : null}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
