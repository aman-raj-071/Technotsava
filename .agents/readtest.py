import io, time
t0 = time.time()
out = []
out.append("start")
with io.open("index.html", "r", encoding="utf-8", errors="replace") as f:
    data = f.read()
out.append("read ok %d in %.2fs" % (len(data), time.time() - t0))
with io.open(".agents/readtest.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
