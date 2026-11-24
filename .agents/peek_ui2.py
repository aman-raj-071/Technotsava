with open("index.html", "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
print("=== 302000-307500 (portal UI) ===")
print(s[302000:307500])
