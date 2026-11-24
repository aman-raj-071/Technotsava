# -*- coding: utf-8 -*-
old = """        if (mode === 'faculty') {
          const normName = (s) => String(s || '').toLowerCase().replace(/\\b(dr|mrs|mr|prof|ms)\\b\\.?/g, '').replace(/[^a-z0-9]/g, '');
const nKey = normName(k);
const found = FACULTY_COORDINATORS.find(
  (f) => normName(f.name) === nKey || normName(f.name).includes(nKey) || nKey.includes(normName(f.name))
);
          if (!found) {
            setLoading(false);
            setErrorMsg('No Faculty Co-ordinator found for name "' + k + '". Please check the spelling.');
            return;
          }"""

new = """        if (mode === 'faculty') {
          const normName = (s) => String(s || '').toLowerCase().replace(/\\b(dr|mrs|mr|prof|ms)\\b\\.?/g, '').replace(/[^a-z0-9]/g, '');
          const nKey = normName(k);
          if (!nKey || nKey.length < 2) {
            setLoading(false);
            setErrorMsg('Please enter at least 2 characters of the Faculty Co-ordinator name.');
            return;
          }
          const scored = FACULTY_COORDINATORS.map((f) => {
            const fn = normName(f.name);
            let score = 0;
            if (fn === nKey) score = 100;
            else if (fn.startsWith(nKey)) score = 80;
            else if (nKey.startsWith(fn)) score = 70;
            else if (fn.includes(nKey) || nKey.includes(fn)) score = 60;
            return { f: f, score: score };
          }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
          if (!scored.length) {
            setLoading(false);
            setErrorMsg('No Faculty Co-ordinator found for name "' + k + '". Please check the spelling.');
            return;
          }
          const best = scored[0];
          const ties = scored.filter((x) => x.score === best.score);
          if (ties.length > 1 && best.score < 100) {
            setLoading(false);
            setErrorMsg('Multiple Faculty Co-ordinators match "' + k + '": ' + ties.map((t) => t.f.name).slice(0, 3).join(', ') + '. Please type more of the full name.');
            return;
          }
          const found = best.f;"""

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    src = f.read()

n = src.count(old)
print("ANCHOR_COUNT", n)
if n == 1:
    src = src.replace(old, new)
    with open('index.html', 'w', encoding='utf-8', errors='replace') as f:
        f.write(src)
    print("REPLACED_OK")
else:
    print("NO_REPLACE")
