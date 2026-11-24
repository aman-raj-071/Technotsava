import sys

def peek(path, label):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'==== {label} size={len(d)}')
    for pat in ['id="name"', 'id="college-tspan"']:
        i = d.find(pat)
        print(f'--- {pat} @ {i}')
        if i >= 0:
            print(d[max(0, i-300):i+500])
    print()

if __name__ == '__main__':
    peek('public/certificate-coordinator-template.svg', 'COORDINATOR')
    peek('public/certificate-template.svg', 'PARTICIPATION')
