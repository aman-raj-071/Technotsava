import re
import sys

def fill_coordinator(name='Sohan Gowda K', college='SJC Institute Of Technology'):
    with open('public/certificate-coordinator-template.svg', encoding='utf-8', errors='replace') as f:
        d = f.read()
    d = d.replace(
        '<text id="name" x="600" y="508" font-family="Poppins" font-size="24" font-weight="700" fill="#4A1518" text-anchor="middle"></text>',
        f'<text id="name" x="600" y="508" font-family="Poppins" font-size="24" font-weight="700" fill="#4A1518" text-anchor="middle">{name}</text>'
    )
    d = re.sub(
        r'<tspan id="college-tspan"[^>]*></tspan>',
        f'<tspan id="college-tspan" font-weight="700" fill="#8A5A12">{college}</tspan>',
        d
    )
    with open('coordinator_test.svg', 'w', encoding='utf-8') as f:
        f.write(d)
    print('wrote coordinator_test.svg', len(d))

if __name__ == '__main__':
    name = sys.argv[1] if len(sys.argv) > 1 else 'Sohan Gowda K'
    fill_coordinator(name)
