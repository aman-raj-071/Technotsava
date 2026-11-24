d = open('index.html', encoding='utf-8', errors='replace').read()

# The duplicate block is the one I inserted: it starts right after the pre-existing array '];' and contains '.college' entries.
# Remove the second 'const COORDINATORS = [' block entirely, leaving only the original one.
first = d.find('const COORDINATORS = [')
second = d.find('const COORDINATORS = [', first + 1)
if second == -1:
    print('Only one array, nothing to do')
else:
    # find end of second block: locate the '];' that closes it, followed by 'function CertificatePortal'
    end_marker = '];\n\nfunction CertificatePortal({ onBack }) {'
    end = d.find(end_marker, second)
    if end == -1:
        # try without newline variants
        end_marker = '];\nfunction CertificatePortal({ onBack }) {'
        end = d.find(end_marker, second)
    if end == -1:
        raise SystemExit('Could not locate end of duplicate array')
    # remove from start of second declaration to just before 'function CertificatePortal'
    removed = d[second:end + len('];\n')]
    d = d[:second] + d[end + len('];\n'):]
    print('Removed duplicate block of length', len(removed))

open('index.html', 'w', encoding='utf-8', newline='') .write(d)
print('Done. Remaining array count:', d.count('const COORDINATORS = ['))
