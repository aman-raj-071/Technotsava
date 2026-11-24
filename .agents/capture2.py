with open('index.html', encoding='utf-8', errors='replace') as f:
    d = f.read()

def show(name, start, length):
    print(f'===== {name} =====')
    print(d[start:start+length])
    print()

i = d.find('svgTemplateCache', d.find('function CertificatePortal'))
show('SVGCACHE_DECL', i-60, 500)

# handleDownloadSinglePdf area for template refs
j = d.find('handleDownloadSinglePdf')
show('DL_SINGLE', j, 1200)

# the search card submit/second area where we could add toggle
r = d.find('ENTER UNIQUE REGISTRATION CODE')
show('SEARCH_CARD', r-200, 700)
