import os, shutil
os.makedirs(".agents/live", exist_ok=True)
for f in ["index.html"]:
    shutil.copy(f, os.path.join(".agents/live", f))
for f in ["certificate-coordinator-template.svg", "certificate-template.svg"]:
    src = os.path.join("public", f)
    if os.path.exists(src):
        shutil.copy(src, os.path.join(".agents/live", f))
print(os.listdir(".agents/live"))
