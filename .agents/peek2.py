import io
s = io.open("index.html", "r", encoding="utf-8", errors="replace").read()
lines = s.split("\n")
def dump(a, b, label):
    with io.open(".agents/peek2_" + label + ".txt", "w", encoding="utf-8") as f:
        for i in range(a, b + 1):
            f.write("%d|%s\n" % (i + 1, lines[i]))
for i, ln in enumerate(lines):
    if "FACULTY COORDINATOR CERTIFICATE" in ln and "CLAIM" not in ln:
        dump(max(0, i-5), i+3, "toggle")
        break
for i, ln in enumerate(lines):
    if "FACULTY_COORDINATORS.find" in ln:
        dump(max(0, i-10), i+14, "branch")
        break
print("done")
