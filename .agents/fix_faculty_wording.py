import io
path = "index.html"
s = io.open(path, "r", encoding="utf-8", errors="replace").read()
old = "svgCoordTemplateCache.replace('has served as a Student Co-ordinator for the Events', 'has served as a Faculty Co-ordinator for the Events')"
new = "svgCoordTemplateCache.split('Student Co-ordinator').join('Faculty Co-ordinator')"
n = s.count(old)
print("occurrences:", n)
if n == 1:
    s = s.replace(old, new)
    io.open(path, "w", encoding="utf-8").write(s)
    print("applied; remaining old:", s.count(old))
else:
    print("NOT applied - anchor count != 1")
