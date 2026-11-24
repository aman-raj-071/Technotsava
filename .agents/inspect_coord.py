import re

def inspect(path, label, ymin=430, ymax=630):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {label} ({ymin}-{ymax}) ====')
    # Match open tags for elements that may carry a y attribute
    pat = re.compile(r'<(text|line|tspan|path|rect|image|g|use)\b([^>]*)>', re.S)
    for m in pat.finditer(d):
        tag, attrs = m.group(1), m.group(2)
        ym = re.search(r'y="([\d.]+)"', attrs)
        if not ym:
            continue
        y = float(ym.group(1))
        if ymin <= y <= ymax:
            print(f'<{tag} y={y}>')
    print()

if __name__ == '__main__':
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else 'public/certificate-coordinator-template.svg'
    ymin = float(sys.argv[2]) if len(sys.argv) > 2 else 430
    ymax = float(sys.argv[3]) if len(sys.argv) > 3 else 630
    inspect(path, path, ymin, ymax)
