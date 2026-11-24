import sys

def inspect(path, label):
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()
    print(f'== {label} size={len(d)}')
    for pat in ['id="name"', 'id="college-tspan"', 'has served as a Student Co-ordinator',
                'has actively participated in the Events', 'We appreciate your outstanding performance and dedication.',
                'We appreciate your outstanding contribution, commitment and dedication.',
                'from SJC Institute Of Technology', 'This is to certify that']:
        print(f'  count({pat!r}) = {d.count(pat)}')

if __name__ == '__main__':
    inspect('public/certificate-coordinator-template.svg', 'coordinator')
    inspect('public/certificate-template.svg', 'participation')
