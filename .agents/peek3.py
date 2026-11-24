import io
s = io.open("index.html", "r", encoding="utf-8", errors="replace").read()
lines = s.split("\n")
def dump(a, b, label):
    with io.open(".agents/peek3_" + label + ".txt", "w", encoding="utf-8") as f:
        for i in range(a, b + 1):
            f.write("%d|%s\n" % (i + 1, lines[i]))
dump(4175, 4200, "getter")
# find callers of the template getter: search for getSvgTemplateText / getTemplateBytes usage
import re
for i, ln in enumerate(lines):
    if "svgCoordTemplateCache" in ln and "if" not in ln and "let " not in ln and "return" not in ln and "=" not in ln:
        dump(max(0, i-2), i+1, "caller")
print("done")
