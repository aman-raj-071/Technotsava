import re
import sys

def dump(path, ymin, ymax):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {path} ====')
    # Match full <text>...</text> blocks (non-greedy) including children
    pat = re.compile(r'<text\b([^>]*)>(.*?)</text>', re.S)
    for m in pat.finditer(d):
        attrs, inner = m.group(1), m.group(2)
        ym = re.search(r'y="([\d.]+)"', attrs)
        if not ym:
            continue
        y = float(ym.group(1))
        if ymin <= y <= ymax:
            xm = re.search(r'x="([\d.]+)"', attrs)
            x = xm.group(1) if xm else '?'
            fontm = re.search(r'font-size="([\d.]+)"', attrs)
            size = fontm.group(1) if fontm else '?'
            # strip inner tags to show visible text
            text = re.sub(r'<[^>]+>', '', inner).strip()
            print(f'y={y} x={x} font={size} | "{text}"')
    print()

if __name__ == '__main__':
    path = sys.argv[1]
    ymin = float(sys.argv[2]) if len(sys.argv) > 2 else 430
    ymax = float(sys.argv[3]) if len(sys.argv) > 3 else 630
    dump(path, ymin, ymax)
