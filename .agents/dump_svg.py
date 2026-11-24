import re

def texts(path, label):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {label} ====')
    # find all <text ...>...</text> (non-greedy, up to 400 chars each)
    for m in re.finditer(r'<text\b[^>]*>(.*?)</text>', d, re.S):
        content = m.group(1)
        attrs = m.group(0)[:160]
        if content.strip():
            print(f'ATTRS: {attrs}')
            print(f'CONTENT_START: {content[:150]!r}')
            print('---')
    print()

if __name__ == '__main__':
    texts('public/certificate-coordinator-template.svg', 'COORDINATOR TEMPLATE')
