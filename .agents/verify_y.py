import re

d = open('index.html', encoding='utf-8', errors='replace').read()

print('=== all y="515" occurrences ===')
for m in re.finditer(r'y="515"', d):
    s = max(0, m.start()-80)
    print('@', m.start(), '...', repr(d[s:m.start()+30]))

print()
print('=== all y="508" occurrences ===')
for m in re.finditer(r'y="508"', d):
    s = max(0, m.start()-80)
    print('@', m.start(), '...', repr(d[s:m.start()+30]))

print()
print('count y=515:', d.count('y="515"'))
print('count y=508:', d.count('y="508"'))
print('coordinator-conditional present:', "mode === 'coordinator' ? '508' : '515'" in d)
