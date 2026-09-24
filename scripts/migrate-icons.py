#!/usr/bin/env python3
"""Migrate every surface from lucide-react to the approved Phosphor stack.

Rules applied (one family per component, one weight, scale sizes):
  * import swap:  'lucide-react' -> '@phosphor-icons/react' (client)
                                   '@phosphor-icons/react/dist/ssr' (server)
  * local aliases preserved (CheckIcon stays CheckIcon, sourced from Check)
  * strokeWidth props removed  -> single weight (Phosphor default 'regular')
  * icon size classes snapped to the scale: size-2/3/3.5 -> size-4 (16px)
  * icons with no size get size={16} so nothing falls back to 1em
"""
import json, re, sys, pathlib

APPLY = '--apply' in sys.argv
MAP = json.load(open('/tmp/icon-map.json'))

FILES = [f for f in json.load(open('/tmp/icon-inventory.json'))['files']
         if not f.endswith('site/home/Infrastructure.tsx')]

ICON_TAG = re.compile(r'<([A-Z][A-Za-z0-9]*)\b(?:[^<>]|\n)*?/>')


def rewrite_import(match, module):
    parts = [p.strip() for p in match.group(1).split(',') if p.strip()]
    out = []
    for part in parts:
        if ' as ' in part:
            src, local = (x.strip() for x in part.split(' as ')[:2])
        else:
            src = local = part.strip()
        target = MAP.get(src)
        if target is None:
            print(f'  !! no mapping for {src}')
            target = src
        out.append(target if target == local else f'{target} as {local}')
    return "import { " + ", ".join(out) + f" }} from '{module}'"


def main():
    total = {'imports': 0, 'stroke': 0, 'classes': 0, 'sizes': 0}
    for name in FILES:
        p = pathlib.Path(name)
        src = p.read_text()
        client = src.lstrip().startswith("'use client'") or src.lstrip().startswith('"use client"')
        module = '@phosphor-icons/react' if client else '@phosphor-icons/react/dist/ssr'

        before = src
        src, n = re.subn(r"import\s*\{([^}]*)\}\s*from\s*['\"]lucide-react['\"]",
                         lambda m: rewrite_import(m, module), src)
        total['imports'] += n

        src, n = re.subn(r'\s+strokeWidth=\{[^}]*\}', '', src)
        total['stroke'] += n

        # icon-local names in this file (after the import swap)
        local = []
        for m in re.finditer(r"import\s*\{([^}]*)\}\s*from\s*'@phosphor-icons/react[^']*'", src):
            for part in m.group(1).split(','):
                part = part.strip()
                if part:
                    local.append(part.split(' as ')[-1].strip())

        def fix_tag(tag_match):
            tag = tag_match.group(0)
            new = tag
            for pat, rep in ((r'\bsize-3\.5\b', 'size-4'), (r'\bsize-3\b', 'size-4'), (r'\bsize-2\b', 'size-4')):
                new, c = re.subn(pat, rep, new)
                if c:
                    total['classes'] += c
            if 'size-' not in new and 'size={' not in new:
                icon = tag_match.group(1)
                new = new.replace(f'<{icon}', f'<{icon} size={{16}}', 1)
                total['sizes'] += 1
            return new

        for icon in set(local):
            src = re.sub(rf'<({re.escape(icon)})\b(?:[^<>]|\n)*?/>', fix_tag, src)

        if src != before:
            print(f'  {name}  [{module.split("/")[-1]}]')
            if APPLY:
                p.write_text(src)
    print('\ntotals:', total, '| applied' if APPLY else '| DRY RUN')


main()
