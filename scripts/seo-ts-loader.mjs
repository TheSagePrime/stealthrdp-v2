import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (specifier.startsWith('.') && !/\.[a-z0-9]+$/i.test(specifier)) {
      for (const extension of ['.ts', '.tsx']) {
        try {
          return await nextResolve(`${specifier}${extension}`, context);
        } catch {}
      }
    }
    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    const source = await readFile(new URL(url), 'utf8');
    return {
      format: 'module',
      source: stripTypeScriptTypes(source, {
        mode: 'transform',
        sourceMap: false,
      }),
      shortCircuit: true,
    };
  }

  return nextLoad(url, context);
}
