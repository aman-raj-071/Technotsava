with open("index.html", "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
print("LEN", len(s))
import re
# Find what text
for kw in ["COORDINATORS", "Student Coordinator", "Faculty", "CertificatePortal", "certificate", "mode", "Participant", "coordinator"]:
    idxs = [m.start() for m in re.finditer(re.escape(kw), s)]
    print(f"\n== {kw!r}: {len(idxs)} occ, first5={idxs[:5]}")
