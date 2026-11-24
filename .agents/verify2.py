d = open('index.html', encoding='utf-8', errors='replace').read()

# where does 'const COORDINATORS = [' appear?
import re
for m in re.finditer('const COORDINATORS = \[', d):
    print('COORDINATORS array at', m.start())

print('--- order ---')
for label, needle in [
    ('COORDINATORS array', 'const COORDINATORS = ['),
    ('function CertificatePortal', 'function CertificatePortal'),
    ('mode state', "const [mode, setMode] = useState('participation')"),
    ('toggle', 'STUDENT COORDINATOR CERTIFICATE'),
    ('handleFetch coord branch', '// Student Coordinator mode'),
    ('renderCertificateToCanvas', 'renderCertificateToCanvas = async'),
    ('footer coordinator', 'STUDENT COORDINATOR CERTIFICATE ↗'),
]:
    p = d.find(needle)
    print(f'{label}: {p}')

# Check that CertificatePortal appears exactly twice (def + usage)
print('CertificatePortal occurrences:', len(re.findall('CertificatePortal', d)))
