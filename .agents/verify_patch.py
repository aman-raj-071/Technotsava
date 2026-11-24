d = open('index.html', encoding='utf-8', errors='replace').read()
checks = {
    'mode state': "const [mode, setMode] = useState('participation')",
    'toggle (STUDENT COORDINATOR CERTIFICATE)': 'STUDENT COORDINATOR CERTIFICATE',
    'coordinator lookup': "mode === 'coordinator'",
    'COORDINATORS array': 'const COORDINATORS = [',
    'coord template ref': 'certificate-coordinator-template.svg',
    'footer coordinator option': 'STUDENT COORDINATOR CERTIFICATE ↗',
    'no duplicate mode (should be 1)': d.count("const [mode, setMode] = useState('participation')"),
}
for label, needle in checks.items():
    print(f'{label}: {d.count(needle)}')

# Basic JS sanity: balanced braces count is not reliable here; check key marker order
print('--- order check ---')
import re
positions = {
    'COORDINATORS array': d.find('const COORDINATORS = ['),
    'function CertificatePortal': d.find('function CertificatePortal'),
    'toggle': d.find('STUDENT COORDINATOR CERTIFICATE'),
    'handleFetch coord branch': d.find('// Student Coordinator mode'),
    'renderCertificateToCanvas': d.find('renderCertificateToCanvas = async'),
}
for k, v in positions.items():
    print(f'{k}: {v}')
