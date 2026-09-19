import fs from 'node:fs';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const contract = readJson('design.contract.json');
const components = readJson(contract.componentSystem.configFile);
const globalCss = fs.readFileSync(contract.tokens.source, 'utf8');
const errors = [];

function listSourceFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) files.push(...listSourceFiles(fullPath));
    else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

if (components.style !== contract.componentSystem.style) {
  errors.push(`shadcn style must remain ${contract.componentSystem.style}`);
}
if (components.aliases?.ui !== contract.componentSystem.uiAlias) {
  errors.push(`shadcn UI alias must remain ${contract.componentSystem.uiAlias}`);
}
if (components.iconLibrary !== contract.componentSystem.iconLibrary) {
  errors.push(`icon library must remain ${contract.componentSystem.iconLibrary}`);
}

for (const token of contract.tokens.required) {
  if (!globalCss.includes(`${token}:`)) errors.push(`missing design token ${token}`);
}

for (const className of contract.protectedSeoStyles) {
  if (!globalCss.includes(`.${className}`)) errors.push(`protected SEO style missing: .${className}`);
}

const sourceFiles = contract.sourceRoots
  .filter(root => fs.existsSync(root))
  .flatMap(root => listSourceFiles(root));

const forbidden = new Set(contract.forbiddenUiPackages);
const importPattern = /(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g;
const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
const arbitraryHexPattern = /(?:bg|text|border|from|via|to|ring|fill|stroke)-\[#[0-9a-fA-F]{3,8}\]/g;
const inlineColorPattern = /(?:color|backgroundColor|borderColor)\s*:\s*['"](?:#|rgb\(|rgba\(|hsl\(|hsla\()/g;
const visualInlineStylePattern = /style=\{\{[^}]*\b(?:color|backgroundColor|borderColor|boxShadow|borderRadius|fontSize|fontFamily)\b[^}]*\}\}/g;
const rawInteractivePattern = /<(?:button|input|select|textarea)\b/g;

const reservedPrimitiveFiles = new Set(contract.componentSystem.reservedPrimitiveFiles ?? []);
const primitiveRoot = contract.componentSystem.primitiveRoot ?? 'src/components/ui';
for (const path of fs.existsSync('src/components') ? listSourceFiles('src/components') : []) {
  const basename = path.split('/').pop();
  if (reservedPrimitiveFiles.has(basename) && !path.startsWith(`${primitiveRoot}/`)) {
    errors.push(`${path}: duplicates reserved UI primitive ${basename}; extend the canonical primitive instead`);
  }
}

for (const path of sourceFiles) {
  const source = fs.readFileSync(path, 'utf8');

  for (const match of source.matchAll(importPattern)) {
    const imported = match[1];
    const root = imported.startsWith('@')
      ? imported.split('/').slice(0, 2).join('/')
      : imported.split('/')[0];
    if (forbidden.has(root) || forbidden.has(imported)) {
      errors.push(`${path}: forbidden UI/icon package import ${imported}`);
    }
  }

  if (contract.rules.forbidHardcodedColorsOutsideTokenFiles) {
    const allowed = contract.tokens.hardcodedColorAllowedPaths.includes(path);
    if (!allowed && hexPattern.test(source)) {
      errors.push(`${path}: hardcoded hex color detected; use design tokens`);
    }
    hexPattern.lastIndex = 0;

    if (!allowed && inlineColorPattern.test(source)) {
      errors.push(`${path}: inline hardcoded color detected; use design tokens`);
    }
    inlineColorPattern.lastIndex = 0;
  }

  if (contract.rules.forbidArbitraryTailwindHexColors && arbitraryHexPattern.test(source)) {
    errors.push(`${path}: arbitrary Tailwind hex color detected; use shadcn/theme tokens`);
  }
  arbitraryHexPattern.lastIndex = 0;

  if (contract.rules.forbidVisualInlineStyles && visualInlineStylePattern.test(source)) {
    errors.push(`${path}: visual inline style detected; use Tailwind and design tokens`);
  }
  visualInlineStylePattern.lastIndex = 0;

  if ((contract.rules.forbidRawInteractiveElementsIn ?? []).some(root => path.startsWith(root))
    && rawInteractivePattern.test(source)) {
    errors.push(`${path}: raw interactive HTML control detected; use the canonical UI primitive`);
  }
  rawInteractivePattern.lastIndex = 0;

  for (const utility of contract.rules.forbiddenDecorationUtilities ?? []) {
    if (source.includes(utility)) {
      errors.push(`${path}: forbidden decorative utility "${utility}" detected`);
    }
  }
}

if (errors.length) {
  for (const error of [...new Set(errors)]) console.error(`[design-contract] ${error}`);
  process.exitCode = 1;
} else {
  console.log('[design-contract] OK');
}
