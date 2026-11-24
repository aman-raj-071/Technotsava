import re, sys
p = 'index.html'
s = open(p, encoding='utf-8').read()

old = "const found = FACULTY_COORDINATORS.find((f) => String(f.name).toLowerCase() === cleanKey);"
new = (
    "const normName = (s) => String(s || '').toLowerCase()"
    ".replace(/\\b(dr|mrs|mr|prof|ms)\\b\\.?/g, '')"
    ".replace(/[^a-z0-9]/g, '');\n"
    "const nKey = normName(k);\n"
    "const found = FACULTY_COORDINATORS.find(\n"
    "  (f) => normName(f.name) === nKey || normName(f.name).includes(nKey) || nKey.includes(normName(f.name))\n"
    ");"
)

n = s.count(old)
out = f"ANCHOR_COUNT={n}\n"
if n == 0:
    out += "ANCHOR_NOT_FOUND\n"
else:
    s = s.replace(old, new)
    open(p, 'w', encoding='utf-8').write(s)
    out += "REPLACED_OK\n"
open('.agents/fix_result.txt', 'w', encoding='utf-8').write(out)
