import re, sys
p = "public/certificate-coordinator-template.svg"
with open(p, "r", encoding="utf-8", errors="replace") as f:
    s = f.read()
# find all <text ...>...</text> blocks
for m in re.finditer(r'<text\b[^>]*>(.*?)</text>', s, re.S):
    attrs = m.group(0)[:200].replace('\n',' ')
    print("TEXT ATTRS:", attrs)
    body = m.group(1)[:300].replace('\n',' ')
    print("   BODY:", body)
# also search for phrases
for phrase in ["has served as a Student Co-ordinator", "has actively participated", "Student Co-ordinator", "Faculty", "We appreciate"]:
    idx = s.find(phrase)
    print(f"PHRASE {phrase!r}: {'FOUND @'+str(idx) if idx>=0 else 'absent'}")
