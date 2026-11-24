with open("index.html", "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
# Print region around CertificatePortal definition
print("=== CertificatePortal region (288000-291000) ===")
print(s[288000:291000])
