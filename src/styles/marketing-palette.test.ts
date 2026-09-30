import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync('src/styles/global.css', 'utf8');
const marketingCss = readFileSync('src/styles/stealth-v3.css', 'utf8');

function luminance(hex: string) {
  const rgb = hex.match(/[a-f\d]{2}/gi)?.map(channel => Number.parseInt(channel, 16) / 255);
  if (!rgb || rgb.length !== 3) {
    throw new Error(`Invalid hex colour ${hex}`);
  }
  const linear = rgb.map(channel => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4);
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

function contrast(a: string, b: string) {
  const bright = Math.max(luminance(a), luminance(b));
  const darkValue = Math.min(luminance(a), luminance(b));
  return (bright + 0.05) / (darkValue + 0.05);
}

function block(css: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1];
}

/** Resolve a hex-valued token from a palette block of global.css. */
function tokenHex(palette: string, name: string) {
  return palette.match(new RegExp(`--${name}:\\s*(#[a-f\\d]{6})`, 'i'))?.[1];
}

const activePalette = block(globalCss, ':root')!;
const darkPalette = block(globalCss, '.dark')!;

function primaryContrast(tokens: string) {
  const background = tokenHex(tokens, 'primary');
  const foreground = tokenHex(tokens, 'primary-foreground');

  expect(background).toBeDefined();
  expect(foreground).toBeDefined();

  return contrast(background!, foreground!);
}

describe('active marketing palette', () => {
  it('keeps one dark palette source available and readable primary action text', () => {
    expect(darkPalette).toBeDefined();
    expect(marketingCss).not.toMatch(/\.dark\s*\{/);
    expect(primaryContrast(darkPalette)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the active light palette readable for primary actions', () => {
    expect(activePalette).toBeDefined();
    expect(primaryContrast(activePalette)).toBeGreaterThanOrEqual(4.5);
  });

  it('uses the primary action token for selected pricing controls', () => {
    const selected = marketingCss.match(/\.sr-segmented-control \[data-slot=["']button["']\]\[aria-pressed=["']true["']\]\s*\{([^}]+)\}/)?.[1];

    expect(selected).toBeDefined();
    expect(selected).toMatch(/background:\s*var\(--primary\)/);
    expect(selected).toMatch(/color:\s*var\(--primary-foreground\)/);
  });

  it('keeps ledger secondary labels readable against the ledger surface', () => {
    const label = [...marketingCss.matchAll(/\.sr-ledger-meta\s*\{([^}]+)\}/g)].at(-1)?.[1];

    expect(label).toBeDefined();

    const token = label!.match(/color:\s*var\(--([a-z-]+)\)/)?.[1];
    const size = Number(label!.match(/font-size:\s*([\d.]+)rem/)?.[1]);

    expect(token).toBeDefined();

    const color = tokenHex(activePalette, token!);
    const card = tokenHex(activePalette, 'card');

    expect(color).toBeDefined();
    expect(card).toBeDefined();
    expect(contrast(color!, card!)).toBeGreaterThanOrEqual(4.5);
    expect(size).toBeGreaterThanOrEqual(0.75);
  });

  it('keeps secondary text readable on every layered surface', () => {
    for (const surface of ['bg', 'card', 'secondary', 'surface-2', 'surface-3'] as const) {
      const text = tokenHex(activePalette, 'text-muted');
      const ground = tokenHex(activePalette, surface);

      expect(ground, `--${surface} must be a hex token`).toBeDefined();
      expect(contrast(text!, ground!), `--text-muted on --${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('never uses a border token as a text colour', () => {
    const allStyles = ['global.css', 'stealth.css', 'surfaces.css', 'stealth-v3.css']
      .map(file => readFileSync(`src/styles/${file}`, 'utf8'))
      .join('\n');

    expect(allStyles).not.toMatch(/(?<!border-)color:\s*var\(--border[a-z-]*\)/);
  });

  it('keeps the marketing stylesheet free of literal colours', () => {
    expect(marketingCss).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(marketingCss).not.toMatch(/\brgba?\(/i);
    expect(marketingCss).not.toMatch(/color:\s*(white|black)\b/i);
  });

  it('keeps marketing surfaces, radii and motion on the shared token scale', () => {
    const onScale = new Set([
      'var(--radius-sm)',
      'var(--radius-md)',
      'var(--radius-lg)',
      'var(--radius-xl)',
      '999px',
      '50%',
      '0',
      'inherit',
    ]);
    for (const radius of marketingCss.matchAll(/border-radius:([^;]+);/g)) {
      const value = radius[1]!.replace('!important', '').trim();
      /* Corner shorthands such as `0 18px 18px 0` are on scale when every corner is. */
      const corners = value.split(' ').filter(Boolean);

      expect(corners.every(corner => onScale.has(corner)), `off-scale radius ${value}`).toBe(true);
    }
  });
});
