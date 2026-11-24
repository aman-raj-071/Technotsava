def patch_bulk():
    path = 'index.html'
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()

    # Bulk ZIP/download path: same hardcoded y="515" name replacement.
    old = ("'<text id=\"name\" x=\"600\" y=\"515\" font-family=\"Poppins\" font-size=\"24\" font-weight=\"700\" fill=\"#4A1518\" text-anchor=\"middle\">' + (m.name || 'Participant') + '</text>'")

    new = ("'<text id=\"name\" x=\"600\" y=\"' + (mode === 'coordinator' ? '508' : '515') + '\" font-family=\"Poppins\" font-size=\"24\" font-weight=\"700\" fill=\"#4A1518\" text-anchor=\"middle\">' + (m.name || 'Participant') + '</text>'")

    count = d.count(old)
    print('occurrences of bulk anchor:', count)
    if count != 1:
        print('ABORT: expected exactly 1 occurrence, found', count)
        return False

    d = d.replace(old, new)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(d)
    print('Patched bulk ZIP/download name Y-coordinate (coordinator -> y=508).')
    return True

if __name__ == '__main__':
    patch_bulk()
