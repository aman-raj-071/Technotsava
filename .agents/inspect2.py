import re
import sys

def inspect(path, label):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {label} ====')
    pat = re.compile(r'<(?![/!])([a-zA-Z]+)([^>]*)>')
    for m in pat.finditer(d):
        tag = m.group(1)
        attrs = m.group(2)
        yvals = re.findall(r'y="([\d.]+)"', attrs)
        if yvals:
            y = float(yvals[0])
            if 450 <= y <= 600:
                content = m.group(0)[:200]
                print(f'<{tag}> {content}')
    print()

if __name__ == '__main__':
    inspect('public/certificate-coordinator-template.svg', 'COORDINATOR y450-600')
    inspect('public/certificate-template.svg', 'PARTICIPATION y450-600')
