import { Quote, Star } from 'lucide-react';
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
                <Quote aria-hidden="true" />
                <div className="srv3-stars" aria-label="Customer review">
                  {[0, 1, 2, 3, 4].map(star => <Star key={star} aria-hidden="true" />)}
                </div>
              </div>
              <blockquote>{item.quote}</blockquote>
              <footer>
                <strong>{item.authorName}</strong>
                <span>
                  {item.publishedOn || item.authorCompany || item.sourceLabel || 'StealthRDP customer'}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
