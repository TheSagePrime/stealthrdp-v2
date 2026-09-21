import { testimonials } from '@/lib/stealth/content';

/**
 * DESIGN.md section 9, position 3: the after-checkout section moves up and
 * becomes the primary trust device. It carries the published customer feedback.
 * The provisioning sequence it used to hold now lives in the hero, where it
 * serves as the page's single operational status object (review R2).
 */
export function AfterCheckout() {
  return (
    <section className="sr-section sr-section-border" id="after-checkout">
      <div className="sr-container">
        <div className="sr-section-head">
          <div>
            <p className="sr-kicker">Customer feedback</p>
            <h2 className="sr-section-title">The part that matters after checkout.</h2>
          </div>
          <p>
            Selected feedback already published by StealthRDP, including
            third-party review sources where available.
          </p>
        </div>

        <div className="sr-feedback">
          <div className="sr-review-grid">
            {testimonials.slice(0, 6).map((item, index) => (
              <article className="sr-review" key={item.id ?? item._id ?? index}>
                <div className="sr-review-mark">“</div>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <strong>{item.authorName}</strong>
                  <span>
                    {item.publishedOn
                      ? item.publishedOn
                      : item.authorCompany
                        ? item.authorCompany
                        : 'StealthRDP customer'}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
