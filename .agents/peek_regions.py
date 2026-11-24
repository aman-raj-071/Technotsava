import io
s = io.open("index.html", "r", encoding="utf-8", errors="replace").read()
lines = s.split("\n")
def dump(a, b, label):
    with io.open(".agents/peek_" + label + ".txt", "w", encoding="utf-8") as f:
        for i in range(a, b + 1):
            f.write("%d|%s\n" % (i + 1, lines[i]))
# toggle button area
dump(4503, 4520, "toggle")
# paragraph area: find line with 'If you are a registered Student Co-ordinator'
for i, ln in enumerate(lines):
    if "If you are a registered Student Co-ordinator" in ln:
        dump(max(0, i-4), i+4, "para")
        break
# faculty branch insert point
for i, ln in enumerate(lines):
    if "// Student Coordinator mode" in ln:
        dump(max(0, i-2), i+6, "branch")
        break
# template selection return
for i, ln in enumerate(lines):
    if "return svgCoordTemplateCache;" in ln and "faculty" not in ln:
        dump(max(0, i-3), i+2, "tmpl")
        break
print("done")
