import io
s = io.open("index.html", "r", encoding="utf-8", errors="replace").read()
lines = s.split("\n")
with io.open(".agents/peek4_roster.txt", "w", encoding="utf-8") as f:
    for i in range(4110, 4136):
        f.write("%d|%s\n" % (i + 1, lines[i]))
# count open/close buttons in toggle region
print("FACULTY_COORDINATORS decls:", s.count("const FACULTY_COORDINATORS"))
print("faculty toggle buttons:", s.count("FACULTY COORDINATOR CERTIFICATE"))
print("'</button>' near toggle handled by eye")
