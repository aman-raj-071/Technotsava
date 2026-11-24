def patch_index():
    path = 'index.html'
    with open(path, encoding='utf-8', errors='replace') as f:
        d = f.read()

    old = ("'<text id=\"name\" x=\"600\" y=\"515\" font-family=\"Poppins\" font-size=\"24\" font-weight=\"700\" fill=\"#4A1518\" text-anchor=\"middle\">' + name + '</text>'")

    new = ("'<text id=\"name\" x=\"600\" y=\"' + (mode === 'coordinator' ? '508' : '515') + '\" font-family=\"Poppins\" font-size=\"24\" font-weight=\"700\" fill=\"#4A1518\" text-anchor=\"middle\">' + name + '</text>'")

    count = d.count(old)
    print('occurrences of exact anchor:', count)
    if count != 1:
        print('ABORT: expected exactly 1 occurrence, found', count)
        return False

    d = d.replace(old, new)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(d)
    print('Patched index.html name Y-coordinate (coordinator -> y=508).')
    return True

if __name__ == '__main__':
    patch_index()
