import io
import sys

path = "src/components/EventsSection.jsx"
with io.open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

# 1) Report any non-ASCII characters
print("NON_ASCII:")
for i, ln in enumerate(lines):
    for ch in ln:
        if ord(ch) > 127:
            print(f"  line {i+1}: U+{ord(ch):04X} {ch!r} in: {ln.rstrip()[:80]}")
            break

# 2) Bracket balance ignoring strings/comments is hard; do a naive count for report.
opens = {'(': 0, '[': 0, '{': 0}
closes = {')': 0, ']': 0, '}': 0}
for i, ln in enumerate(lines):
    for ch in ln:
        if ch in opens:
            opens[ch] += 1
        elif ch in closes:
            closes[ch] += 1
print("OPEN", opens)
print("CLOSE", closes)

# 3) Count JSX tag tokens naively
import re
depth = 0
line_start = 0
for i, ln in enumerate(lines):
    for m in re.finditer(r'</?[A-Za-z][A-Za-z0-9]*', ln):
        tag = m.group(0)
        if tag.startswith('</'):
            depth -= 1
        else:
            # self-closing? check the char after the tag name
            after = ln[m.end():]
            if after.lstrip().startswith('/'):
                continue
            depth += 1
    # crude logging only if wildly off
print("NAIVE_JSX_DEPTH_END", depth)
