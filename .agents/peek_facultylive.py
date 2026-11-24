with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()
out = []
start = 4250
end = 4315
for i in range(start - 1, min(end, len(lines))):
    out.append(f"{i+1}| {lines[i].rstrip()}")
with open('.agents/peek_facultylive.txt', 'w', encoding='utf-8') as g:
    g.write("\n".join(out))
print("done", len(lines))
