with open("index.html", "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
# find end of the roster array at 283337
start = 283337
# find the closing '];' after start
end = s.find("];", start)
print("roster array end at:", end)
print(s[end-200:end+200])
# find footer cert links (🎓 around 238000? and 323049)
print("\n=== footer area 238000-239000 ===")
print(s[237800:239000])
