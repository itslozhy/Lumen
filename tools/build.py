#!/usr/bin/env python3
"""Gera dist/lumen.html: o jogo inteiro num único arquivo HTML.

Junta o CSS e todos os scripts listados no index.html, na mesma ordem.
Útil para publicar como artifact do Claude ou mandar o jogo como um arquivo só.

Uso: python3 tools/build.py
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def main():
    html = read('index.html')
    html = re.sub(
        r'<link rel="stylesheet" href="([^"]+)"/>',
        lambda m: '<style>\n' + read(m.group(1)) + '</style>',
        html,
    )
    html = re.sub(
        r'<script src="([^"]+)"></script>',
        lambda m: '<script>\n' + read(m.group(1)).replace('</script', '<\\/script') + '</script>',
        html,
    )
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    out = os.path.join(ROOT, 'dist', 'lumen.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Gerado %s (%.1f MB)' % (os.path.relpath(out, ROOT), os.path.getsize(out) / 1e6))


if __name__ == '__main__':
    main()
