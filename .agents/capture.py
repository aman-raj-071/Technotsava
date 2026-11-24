with open('index.html', encoding='utf-8', errors='replace') as f:
    d = f.read()

def show(name, start, length):
    print(f'===== {name} =====')
    print(d[start:start+length])
    print()

# CertificatePortal function header (state declarations)
i = d.find('function CertificatePortal')
show('CERT_FN_HEAD', i, 1200)

# preload effect
j = d.find("// Preload certificate template image")
show('PRELOAD', j, 700)

# getSvgTemplate
k = d.find('const getSvgTemplate')
show('GETSVG', k, 700)

# handleFetch start
h = d.find('const handleFetch')
show('HANDLEFETCH_HEAD', h, 900)

# return/JSX header area (toggle insertion point)
r = d.find('return (', d.find('function CertificatePortal'))
show('JSX_HEAD', r, 900)

# footer claim certificate button
fb = d.find('CLAIM CERTIFICATE')
show('FOOTER', fb-400, 900)
