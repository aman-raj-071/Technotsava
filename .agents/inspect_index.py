with open("index.html", "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
print("LEN", len(s))
head = s[:2500]
print(head)
print("...ROOT DIV...")
i = s.find('id="root"')
print("root div idx:", i)
print(s[i-200:i+300] if i>=0 else "no root div")
