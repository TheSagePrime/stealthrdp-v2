import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/utils/Helpers';
import { testimonials } from '@/lib/stealth/content';

/** Third-party reviews name the site they were published on; first-party
    testimonials say so. The design contract forbids blurring the two. */
function sourceLabelFor(item: (typeof testimonials)[number]) {
  if (!item.sourceUrl) {
    return 'Verified customer testimonial';
  }
  return 'Verified third-party customer review';
}

export function AfterCheckout() {
  return (
    <section className="sr-section srv3-reviews-section" id="reviews">
      <div className="sr-container">
        <div className="srv3-section-heading">
          <div>
            <h2>Verified customer testimonials</h2>
          </div>
          <p>
            Selected customer feedback from verified testimonial and third-party review sources.
          </p>
        </div>

        <div className="srv3-review-grid">
          {testimonials.slice(0, 6).map((item, index) => (
            <Card
              key={item.id ?? item._id ?? index}
              className={cn('gap-4', index === 0 && 'bg-surface-2')}
            >
              <CardHeader>
                <Badge variant="outline" className="w-fit text-body-muted">
                  {sourceLabelFor(item)}
                </Badge>
              </CardHeader>

              <CardContent>
                <blockquote className="text-body leading-relaxed text-body-text">
                  {item.quote}
                </blockquote>
              </CardContent>

              <CardFooter className="mt-auto items-end justify-between gap-4">
                <div className="grid gap-0.5">
                  <strong className="text-small font-semibold text-body-text">
                    {item.authorName}
                  </strong>
                  <span className="text-micro text-body-dim">
                    {item.authorCompany || item.publishedOn || 'StealthRDP customer'}
                  </span>
                </div>
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View source for review by ${item.authorName}`}
                    className="
                      grid size-11 shrink-0 place-items-center rounded-md border
                      border-divider text-primary transition-colors
                      hover:border-border-soft hover:text-accent-hover
                    "
                  >
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
