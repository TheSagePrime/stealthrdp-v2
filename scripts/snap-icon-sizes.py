#!/usr/bin/env python3
"""Snap every UI-icon svg width/height in the stylesheets onto the icon scale.

Allowed icon sizes: 16 / 20 / 24 / 32.
Skipped on purpose: .srv3-rack-* (the hero server-rack illustration, not an icon)
and .sr-location-mark (brand/flag marks, governed by the brand-mark rule).
"""
import pathlib, re

ALLOWED = (16, 20, 24, 32)
SKIP = ('rack', 'location-mark')

count = 0


def snap(value: float) -> int:
    return min(ALLOWED, key=lambda a: (abs(a - value), a))


def main() -> None:
    global count
    for path in sorted(pathlib.Path('src/styles').glob('*.css')):
        text = path.read_text()
        out = []
        pos = 0
        for m in re.finditer(r'([^{}]*svg[^{}]*)\{([^}]*)\}', text):
            out.append(text[pos:m.start()])
            sel, body = m.group(1), m.group(2)
            if any(s in sel for s in SKIP):
                out.append(m.group(0))
                pos = m.end()
                continue
            new_body = body
            for prop in ('width', 'height'):
                def repl(mm, prop=prop):
                    global count
                    value = float(mm.group(1)) * (16 if mm.group(2) == 'rem' else 1)
                    if round(value) in ALLOWED:
                        return mm.group(0)
                    target = snap(value)
                    count += 1
                    return (f'{prop}: {target}px' if mm.group(2) == 'px'
                            else f'{prop}: {("%g" % (target / 16))}rem')
                new_body = re.sub(rf'{prop}:\s*([\d.]+)(px|rem)', repl, new_body)
            out.append(sel + '{' + new_body + '}')
            pos = m.end()
        out.append(text[pos:])
        new_text = ''.join(out)
        if new_text != text:
            path.write_text(new_text)
            print(f'  updated {path.name}')
    print('values snapped:', count)


main()
