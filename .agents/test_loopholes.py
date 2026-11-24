# Simulate the new scoring logic against the real roster
faculty = [
    {'name': 'Dr. Murthy DHR'}, {'name': 'Mrs. Divya M N'}, {'name': 'Dr. Gavina CG'},
    {'name': 'Anita TM'}, {'name': 'Dr. Ajay N'}, {'name': 'Varun Kumar N'},
    {'name': 'E Akhilla'}, {'name': 'Dr. Shrihari MR'}, {'name': 'Divakar K M'},
    {'name': 'Dr. Shwetha T'}, {'name': 'Suman J'}, {'name': 'Udayapriya'},
    {'name': 'Dr. Rashmi KA'}, {'name': 'Mrs. Navyashri N'}, {'name': 'Mamatha'},
    {'name': 'Divyshree V'}, {'name': 'Chanadana D Swamy'},
]

def norm(s):
    import re
    s = re.sub(r'\b(dr|mrs|mr|prof|ms)\b\.?', '', str(s or '').lower())
    s = re.sub(r'[^a-z0-9]', '', s)
    return s

def lookup(key):
    k = key.strip()
    nKey = norm(k)
    if not nKey or len(nKey) < 2:
        return ('SHORT/EMPTY', None)
    scored = []
    for f in faculty:
        fn = norm(f['name'])
        score = 0
        if fn == nKey: score = 100
        elif fn.startswith(nKey): score = 80
        elif nKey.startswith(fn): score = 70
        elif fn in nKey or nKey in fn: score = 60
        if score > 0:
            scored.append((score, f['name']))
    scored.sort(key=lambda x: -x[0])
    if not scored:
        return ('NONE', None)
    best = scored[0]
    ties = [x for x in scored if x[0] == best[0]]
    if len(ties) > 1 and best[0] < 100:
        return ('AMBIGUOUS', [t[1] for t in ties[:3]])
    return ('OK', best[1])

cases = [
    ('RASHMI K A', 'Dr. Rashmi KA'),
    ('Rashmi', 'Dr. Rashmi KA'),
    ('dr rashmi ka', 'Dr. Rashmi KA'),
    ('MURTHY', 'Dr. Murthy DHR'),
    ('Divya', 'Mrs. Divya M N'),
    ('Navya', None),  # partial -> should be OK (unique)
    ('a', 'SHORT/EMPTY'),  # 1 char must be rejected
    ('Dr.', 'SHORT/EMPTY'),  # normalizes to empty
    ('', 'SHORT/EMPTY'),
    ('di', 'AMBIGUOUS'),  # matches Divya, Divakar, Divyshree
    ('divakar', 'Divakar K M'),
]
fail = 0
for inp, want in cases:
    got = lookup(inp)
    status = got[0]
    name = got[1] if len(got) > 1 else None
    if want == 'SHORT/EMPTY':
        ok = (status == 'SHORT/EMPTY')
    elif want == 'AMBIGUOUS':
        ok = (status == 'AMBIGUOUS')
    elif want is None:
        ok = (status == 'OK' and name is not None)
    else:
        ok = (status == 'OK' and name == want)
    if not ok:
        fail += 1
    print(f"{'PASS' if ok else 'FAIL'}  '{inp}' -> {status} {name} (want {want})")
print("\nTOTAL FAILURES:", fail)
