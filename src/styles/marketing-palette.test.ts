import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync('src/styles/global.css', 'utf8');
const marketingCss = readFileSync('src/styles/stealth-v3.css', 'utf8');

function primaryContrast(tokens: string) {
  const background = tokens.match(/--primary:\s*(#[a-f\d]{6})/i)?.[1];
  const foreground = tokens.match(/--primary-foreground:\s*(#[a-f\d]{6})/i)?.[1];
  expect(background).toBeDefined();
  expect(foreground).toBeDefined();
  const bright = Math.max(luminance(background!), luminance(foreground!));
  const darkValue = Math.min(luminance(background!), luminance(foreground!));
  return (bright + 0.05) / (darkValue + 0.05);
}

function luminance(hex: string) {
  const rgb = hex.match(/[a-f\d]{2}/gi)?.map(channel => Number.parseInt(channel, 16) / 255);
  if (!rgb || rgb.length !== 3) throw new Error(`Invalid hex colour ${hex}`);
  const linear = rgb.map(channel => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4);
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

describe('active marketing palette', () => {
  it('has one dark token source and readable primary action text', () => {
    const dark = globalCss.match(/\.dark\s*\{([^}]+)\}/)?.[1];
    expect(dark).toBeDefined();
    expect(marketingCss).not.toMatch(/\.dark\s*\{/);
    expect(primaryContrast(dark!)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps light-mode foundation components readable', () => {
    const light = globalCss.match(/:root\s*\{([^}]+)\}/)?.[1];
    expect(light).toBeDefined();
    expect(primaryContrast(light!)).toBeGreaterThanOrEqual(4.5);
  });

  it('uses the primary action token for selected pricing controls', () => {
    const selected = marketingCss.match(/\.sr-segmented-control \[data-slot="button"\]\[aria-pressed="true"\]\s*\{([^}]+)\}/)?.[1];
    expect(selected).toBeDefined();
    expect(selected).toMatch(/background:\s*var\(--primary\)/);
    expect(selected).toMatch(/color:\s*var\(--primary-foreground\)/);
  });

  it('keeps plan region labels readable against the dark cards', () => {
    const label = [...marketingCss.matchAll(/\.sr-plan-region\s*\{([^}]+)\}/g)].at(-1)?.[1];
    expect(label).toBeDefined();
    const color = label!.match(/color:\s*(#[a-f\d]{6})/i)?.[1];
    const size = Number(label!.match(/font-size:\s*([\d.]+)rem/)?.[1]);
    const dark = globalCss.match(/\.dark\s*\{([^}]+)\}/)?.[1];
    const card = dark?.match(/--card:\s*(#[a-f\d]{6})/i)?.[1];
    expect(color).toBeDefined();
    expect(card).toBeDefined();
    expect((luminance(color!) + 0.05) / (luminance(card!) + 0.05)).toBeGreaterThanOrEqual(4.5);
    expect(size).toBeGreaterThanOrEqual(0.75);
  });
});
