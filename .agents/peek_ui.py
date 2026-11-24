with open("index.html", "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
import re
for kw in ["Participation Certificate", "Student Coordinator Certificate", "Claim Certificate", "🎓", "🎉", "onOpenCoordinator", "onOpenCertificate", "mode === 'coordinator'", "mode === 'faculty'"]:
    idxs = [m.start() for m in re.finditer(re.escape(kw), s)]
    print(f"{kw!r}: {len(idxs)} occ -> {idxs[:8]}")
# find the second coord array (the actual roster used by CertificatePortal) around 283337
print("\n=== around 282900-283900 (coord array) ===")
print(s[282900:283900])
