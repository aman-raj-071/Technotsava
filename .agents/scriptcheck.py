import re
d = open('index.html', encoding='utf-8', errors='replace').read()

# Find all <script ...>...</script> blocks
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', d, re.S)
print('total script blocks:', len(scripts))
for i, s in enumerate(scripts):
    # Determine type from preceding tag
    m = re.search(r'<script\b[^>]*>', d)
    # simpler: look at the immediate open tag
    tagend = d.find(s)
    tagstart = d.rfind('<script', 0, tagend)
    opentag = d[tagstart:tagend]
    print(i, 'len', len(s), 'open tag:', opentag.strip()[:80])
print('Babel/browser inline present:', any('babel' in x for x in scripts))
