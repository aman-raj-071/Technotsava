with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    src = f.read()

checks = {
    'empty_length_guard': 'if (!nKey || nKey.length < 2) {',
    'scored_mapper': 'const scored = FACULTY_COORDINATORS.map((f) => {',
    'ties_guard': 'if (ties.length > 1 && best.score < 100) {',
    'old_find_gone': 'FACULTY_COORDINATORS.find(\n  (f) => normName(f.name) === nKey',
    'nick_guard': 'Please enter at least 2 characters of the Faculty Co-ordinator name.',
    'multiple_guard': 'Multiple Faculty Co-ordinators match',
}
for k, v in checks.items():
    cnt = src.count(v)
    print(k, cnt)
# ensure only one faculty block
print("faculty blocks:", src.count("mode === 'faculty'"))
