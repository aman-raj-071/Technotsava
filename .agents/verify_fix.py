d = open('index.html', encoding='utf-8', errors='replace').read()
anchor = "mode === 'coordinator' ? '508' : '515'"
i = d.find(anchor)
print('coordinator-conditional found at:', i)
if i >= 0:
    print(repr(d[i-160:i+160]))
# Also confirm no leftover hardcoded y="515" name replacement remains
leftover = 'y="515" font-family="Poppins" font-size="24" font-weight="700" fill="#4A1518" text-anchor="middle">\' + name'
print('leftover hardcoded y=515 name:', d.find(leftover))
