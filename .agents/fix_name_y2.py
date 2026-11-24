import io
path = "index.html"
s = io.open(path, "r", encoding="utf-8", errors="replace").read()
old = "(mode === 'coordinator' ? '508' : '515')"
new = "(mode === 'coordinator' || mode === 'faculty' ? '508' : '515')"
n = s.count(old)
print("occurrences before:", n)
s = s.replace(old, new)
io.open(path, "w", encoding="utf-8").write(s)
print("remaining:", s.count(old))
