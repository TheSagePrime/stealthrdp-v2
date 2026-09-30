import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const hero = readFileSync('src/components/site/home/HomeHero.tsx', 'utf8');
const css = readFileSync('src/styles/stealth-v3.css', 'utf8');

describe('homepage infrastructure illustration', () => {
  it('does not imply live readiness or use gradient headline text', () => {
    expect(hero).not.toMatch(/>Ready\s*</);
    expect(hero).toMatch(/className="srv3-hero-visual" aria-hidden="true"/);
    expect(hero).not.toContain('srv3-hero-gridwash');
    expect(css).not.toContain('.srv3-hero-gridwash {');
    expect(css).not.toMatch(/\.srv3-rack-shell\s*\{[^}]*border-radius:\s*24px/);
    expect(css).not.toMatch(/\.srv3-final-cta\s*\{[^}]*border-radius:\s*24px/);
    expect(css).not.toMatch(/\.srv3-hero-copy h1 span\s*\{[^}]*background-clip:\s*text/);
  });
});
