import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runLiveOpenSeoResearch } from '../src/libs/seo/open-seo-live-research.ts';

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function positiveInteger(name) {
  const raw = required(name);
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

const keywords = required('SEO_RESEARCH_KEYWORDS')
  .split(',')
  .map((keyword) => keyword.trim())
  .filter(Boolean);

if (keywords.length === 0) throw new Error('SEO_RESEARCH_KEYWORDS must contain at least one keyword');

const identity = {
  project: required('SEO_RESEARCH_PROJECT'),
  canonical_domain: required('SEO_RESEARCH_CANONICAL_DOMAIN'),
  country: required('SEO_RESEARCH_COUNTRY').toUpperCase(),
  locale: required('SEO_RESEARCH_LOCALE'),
  open_seo: {
    project_id: required('OPEN_SEO_PROJECT_ID'),
    location_code: positiveInteger('OPEN_SEO_LOCATION_CODE'),
    language_code: required('OPEN_SEO_LANGUAGE_CODE'),
  },
};

const result = await runLiveOpenSeoResearch(
  {
    mcpUrl: required('OPEN_SEO_MCP_URL'),
    apiKey: process.env.OPEN_SEO_API_KEY?.trim() || undefined,
  },
  { identity, keywords },
);

const output = `${JSON.stringify(result, null, 2)}\n`;
const outputPath = process.env.SEO_RESEARCH_OUTPUT?.trim();

if (outputPath) {
  const target = resolve(outputPath);
  await writeFile(target, output, 'utf8');
  console.error(`Live OpenSEO research artifact written to ${target}`);
}

process.stdout.write(output);
