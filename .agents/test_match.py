def normName(s):
    import re
    return (re.sub(r'\b(dr|mrs|mr|prof|ms)\b\.?', '', s, flags=re.I)
            .lower()
            .replace('.', '')
            .replace(' ', ''))

roster = ['Dr. Rashmi KA', 'Mrs. Divya M N', 'Dr. Murthy DHR', 'Dr. Gavina CG', 'Chanadana D Swamy']

tests = {
    'RASHMI K A': 'Dr. Rashmi KA',
    'Rashmi': 'Dr. Rashmi KA',
    'dr rashmi ka': 'Dr. Rashmi KA',
    'RASHMIKA': 'Dr. Rashmi KA',
    'DIVYA M N': 'Mrs. Divya M N',
    'Divya': 'Mrs. Divya M N',
    'MURTHY': 'Dr. Murthy DHR',
    'gavina': 'Dr. Gavina CG',
    'CHANADANA D SWAMY': 'Chanadana D Swamy',
}

lines = []
for inp, expected in tests.items():
    nk = normName(inp)
    found = None
    for f in roster:
        nf = normName(f)
        if nf == nk or nf in nk or nk in nf:
            found = f
            break
    status = 'OK ' if found == expected else 'FAIL'
    lines.append(f"{status} input={inp!r} -> {found!r} (expected {expected!r})")
open('.agents/test_result.txt', 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
