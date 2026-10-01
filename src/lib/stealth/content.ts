import faqsJson from '@/content/faqs.json';
import plansJson from '@/content/plans.json';
import reviewsJson from '@/content/reviews.json';
import testimonialsJson from '@/content/testimonials.json';
import uptimeJson from '@/content/uptime.json';

export type BillingCycle = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biannual';

export type Plan = {
  name: string;
  description: string;
  location: 'USA' | 'EU';
  popular: boolean;
  specs: { cpu: string; ram: string; storage: string; bandwidth: string };
  purchaseUrl: string;
  source: { url: string; availability: 'in-stock' | 'out-of-stock' | string; stock?: number; os?: 'linux-only' | 'linux-windows' | string };
  pricing: Record<BillingCycle, {
    amount: number;
    referenceAmount?: number;
    suffix: string;
    periodLabel: string;
    discountLabel?: string;
  }> & { currency: string };
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
};

export type Testimonial = {
  id?: string;
  _id?: string;
  quote: string;
  authorName: string;
  authorPosition?: string;
  authorCompany?: string;
  publishedOn?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  sourceType?: string;
};

export const plans = plansJson.plans as Plan[];
export const faqs = (faqsJson as Faq[]).filter(item => item.isPublished);
export const testimonials = testimonialsJson as Testimonial[];
export const reviews = reviewsJson as Testimonial[];
export const uptime = uptimeJson;

export { billingCycles, checkoutUrl } from './checkout';
