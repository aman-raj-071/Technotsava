import re
import sys

def dump(path, ymin, ymax):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {path} lines/rects {ymin}-{ymax} ====')
    for tag in ('line', 'rect', 'path'):
        # line: x1 y1 x2 y2; rect: x y width height; path: d
        if tag == 'line':
            pat = re.compile(r'<line\b([^>]*)>', re.S)
            for m in pat.finditer(d):
                attrs = m.group(1)
                y1 = re.search(r'y1="([\d.]+)"', attrs)
                y2 = re.search(r'y2="([\d.]+)"', attrs)
                if not (y1 and y2):
                    continue
                yy1, yy2 = float(y1.group(1)), float(y2.group(1))
                if min(yy1, yy2) <= ymax and max(yy1, yy2) >= ymin:
                    print('LINE', m.group(0)[:160])
        elif tag == 'rect':
            pat = re.compile(r'<rect\b([^>]*)>', re.S)
            for m in pat.finditer(d):
                attrs = m.group(1)
                y = re.search(r'y="([\d.]+)"', attrs)
                h = re.search(r'height="([\d.]+)"', attrs)
                if not (y and h):
                    continue
                yy = float(y.group(1))
                hh = float(h.group(1))
                if yy <= ymax and yy + hh >= ymin:
                    print('RECT', m.group(0)[:160])
        else:
            pat = re.compile(r'<path\b([^>]*)>', re.S)
            for m in pat.finditer(d):
                attrs = m.group(1)
                # crude: check if any y-like coordinates fall in band via 'M..C..' numeric tokens
                nums = [float(x) for x in re.findall(r'[-+]?\d+\.?\d*', attrs)]
                if any(ymin <= n <= ymax for n in nums):
                    print('PATH', attrs[:180])
    print()

if __name__ == '__main__':
    path = sys.argv[1]
    ymin = float(sys.argv[2]) if len(sys.argv) > 2 else 470
    ymax = float(sys.argv[3]) if len(sys.argv) > 3 else 560
    dump(path, ymin, ymax)
