import re

d = open('index.html', encoding='utf-8', errors='replace').read()
anchor = "mode === 'coordinator' ? '508' : '515'"
ms = [m.start() for m in re.finditer(re.escape(anchor), d)]
print('conditional occurrences at:', ms)
print('count:', len(ms))
# also confirm PDF path (jsPDF) in bulk uses the conditional too
print('bulk conditional near menPDF:', ...)
# quick: show both contexts
for i, pos in enumerate(ms):
    print('--- occurrence', i, '---')
    print(repr(d[pos-90:pos+40]))
