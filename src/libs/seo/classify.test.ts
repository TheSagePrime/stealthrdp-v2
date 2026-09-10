import { describe, expect, it } from 'vitest';
import { defaultSeoConfig } from '../../config/seo';
import { classifyPath, robotsForClass } from './classify';

describe('SEO route classification', () => {
  it.each([
    ['/', 'publicMarketing'],
    ['/fr', 'publicMarketing'],
    ['/sign-in', 'publicUtility'],
    ['/fr/sign-up', 'publicUtility'],
    ['/dashboard', 'privatePage'],
    ['/fr/dashboard/user-profile', 'privatePage'],
    ['/api/polar/checkout', 'publicApi'],
    ['/api/polar/portal', 'privateApi'],
    ['/api/polar/webhook', 'webhookApi'],
    ['/api/health', 'systemApi'],
    ['/api/ready', 'systemApi'],
    ['/not-registered', 'unknown'],
    ['/api/not-registered', 'unknown'],
  ] as const)('classifies %s as %s', (path, expected) => {
    expect(classifyPath(path, defaultSeoConfig)).toBe(expected);
  });

  it('keeps API and unknown classes out of the index', () => {
    for (const routeClass of ['publicApi', 'privateApi', 'webhookApi', 'systemApi', 'unknown'] as const) {
      expect(robotsForClass(routeClass)).toBe('noindex, nofollow');
    }
  });
});
