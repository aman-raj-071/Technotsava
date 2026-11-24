import re
import sys

def dump(path, target_y):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {path} ====')
    pat = re.compile(r'<text\b([^>]*)>(.*?)</text>', re.S)
    for m in pat.finditer(d):
        attrs, inner = m.group(1), m.group(2)
        ym = re.search(r'y="([\d.]+)"', attrs)
        if not ym:
            continue
        y = float(ym.group(1))
        if abs(y - target_y) < 2:
            print('TAG:', m.group(0))
    print()

if __name__ == '__main__':
    path = sys.argv[1]
    ty = float(sys.argv[2])
    dump(path, ty)
