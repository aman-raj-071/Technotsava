# Patch: add Faculty Coordinator mode to the live index.html CertificatePortal
import io

path = "index.html"
s = io.open(path, "r", encoding="utf-8", errors="replace").read()
orig = s

def rep(old, new, label):
    global s
    n = s.count(old)
    if n == 0:
        raise SystemExit(f"ANCHOR NOT FOUND [{label}]")
    if n > 1:
        # if multiple, only replace the first and warn
        s = s.replace(old, new, 1)
        print(f"  [warn] {label}: found {n} anchors, replaced first")
    else:
        s = s.replace(old, new)
        print(f"  [ok] {label}")

# 1) Insert FACULTY_COORDINATORS roster before CertificatePortal definition
faculty = """const FACULTY_COORDINATORS = [
  { name: 'Dr. Murthy DHR', designation: 'Faculty Coordinator (Ideathon)' },
  { name: 'Mrs. Divya M N', designation: 'Faculty Coordinator (Ideathon)' },
  { name: 'Dr. Gavina CG', designation: 'Faculty Coordinator (Digital Tech Hunt)' },
  { name: 'Anita TM', designation: 'Faculty Coordinator (Digital Tech Hunt)' },
  { name: 'Dr. Ajay N', designation: 'Faculty Coordinator (Tech Quiz)' },
  { name: 'Varun Kumar N', designation: 'Faculty Coordinator (Tech Quiz)' },
  { name: 'E Akhilla', designation: 'Faculty Coordinator (Tech Quiz)' },
  { name: 'Dr. Shrihari MR', designation: 'Faculty Coordinator (Free Fire)' },
  { name: 'Divakar K M', designation: 'Faculty Coordinator (Free Fire)' },
  { name: 'Dr. Shwetha T', designation: 'Faculty Coordinator (Logo Mania)' },
  { name: 'Suman J', designation: 'Faculty Coordinator (Logo Mania)' },
  { name: 'Udayapriya', designation: 'Faculty Coordinator (Logo Mania)' },
  { name: 'Dr. Rashmi KA', designation: 'Faculty Coordinator (Videography)' },
  { name: 'Mrs. Navyashri N', designation: 'Faculty Coordinator (Videography)' },
  { name: 'Mamatha', designation: 'Faculty Coordinator (Minute to Win-It)' },
  { name: 'Divyshree V', designation: 'Faculty Coordinator (Minute to Win-It)' },
  { name: 'Chanadana D Swamy', designation: 'Faculty Coordinator (Minute to Win-It)' },
];


"""
rep("function CertificatePortal({ onBack }) {", faculty + "function CertificatePortal({ onBack }) {", "insert faculty roster")

# 2) Hash parsing: accept faculty mode
rep(
    "if (m === 'coordinator') setMode('coordinator');",
    "if (m === 'coordinator') setMode('coordinator');\n          if (m === 'faculty') setMode('faculty');",
    "hash parsing faculty",
)

# 3) Template selection: faculty uses coordinator template + wording swap
rep(
    "const isCoord = mode === 'coordinator';",
    "const isCoord = mode === 'coordinator' || mode === 'faculty';",
    "template isCoord",
)
rep(
    "          return svgCoordTemplateCache;\n        }",
    "          if (mode === 'faculty') {\n            return svgCoordTemplateCache.replace('has served as a Student Co-ordinator for the Events', 'has served as a Faculty Co-ordinator for the Events');\n          }\n          return svgCoordTemplateCache;\n        }",
    "template faculty wording",
)

# 4) Name Y for faculty
rep(
    "(mode === 'coordinator' ? '508' : '515')",
    "(mode === 'coordinator' || mode === 'faculty' ? '508' : '515')",
    "name Y faculty",
)

# 5) handleFetch: faculty branch before coordinator branch
facultFetch = """        // Faculty Coordinator mode: look up by FULL NAME (case-insensitive)
        if (mode === 'faculty') {
          const found = FACULTY_COORDINATORS.find((f) => String(f.name).toLowerCase() === cleanKey);
          if (!found) {
            setLoading(false);
            setErrorMsg('No Faculty Co-ordinator found for name "' + k + '". Please check the spelling.');
            return;
          }
          const facultyMember = {
            id: 'faculty',
            name: found.name,
            usn: found.designation || 'Faculty',
            role: 'Faculty Coordinator',
            college: 'S J C Institute of Technology',
            event: 'Technotsava 8.0'
          };
          setTeamRecord({ reg_id: 'FAC-TECH26-' + cleanKey.replace(/[^a-z0-9]/g, '').toUpperCase(), leader_name: found.name, event_name: 'Technotsava 8.0' });
          setMembersList([facultyMember]);
          setSelectedMember(facultyMember);
          setSuccessMsg('🎉 Verified! Faculty Co-ordinator certificate ready for ' + found.name + '.');
          setLoading(false);
          if (window.confetti) {
            try { window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
          }
          return;
        }

"""
rep(
    "        // Student Coordinator mode: look up by USN in the coordinator roster\n        if (mode === 'coordinator') {",
    facultFetch + "        // Student Coordinator mode: look up by USN in the coordinator roster\n        if (mode === 'coordinator') {",
    "handleFetch faculty branch",
)

# 6) Header H1
rep(
    "{mode === 'coordinator' ? 'CLAIM STUDENT COORDINATOR CERTIFICATE' : 'CLAIM PARTICIPATION CERTIFICATES'}",
    "{mode === 'faculty' ? 'CLAIM FACULTY COORDINATOR CERTIFICATE' : mode === 'coordinator' ? 'CLAIM STUDENT COORDINATOR CERTIFICATE' : 'CLAIM PARTICIPATION CERTIFICATES'}",
    "header h1",
)

# 7) Header paragraph
rep(
    "              {mode === 'coordinator' ? (\n                <>Enter your <span className=\"font-bold text-black underline\">USN</span>. If you are a registered Student Co-ordinator, your certificate will be fetched and ready to preview or download!</>\n              ) : (",
    "              {mode === 'faculty' ? (\n                <>Enter your <span className=\"font-bold text-black underline\">Full Name</span>. If you are a registered Faculty Co-ordinator, your certificate will be fetched and ready to preview or download!</>\n              ) : mode === 'coordinator' ? (\n                <>Enter your <span className=\"font-bold text-black underline\">USN</span>. If you are a registered Student Co-ordinator, your certificate will be fetched and ready to preview or download!</>\n              ) : (",
    "header paragraph",
)

# 8) Toggle button (add after coordinator button)
rep(
    "              🎓 STUDENT COORDINATOR CERTIFICATE\n            </button>\n          </div>",
    "              🎓 STUDENT COORDINATOR CERTIFICATE\n            </button>\n            <button\n              onClick={() => { setMode('faculty'); setErrorMsg(''); setSuccessMsg(''); }}\n              className={mode === 'faculty' ? 'px-4 py-2 font-mono font-black text-xs bg-[#FFB3D9] text-black border-3 border-black brutal-shadow-sm' : 'px-4 py-2 font-mono font-black text-xs bg-white text-black border-3 border-black'}\n            >\n              👩‍🏫 FACULTY COORDINATOR CERTIFICATE\n            </button>\n          </div>",
    "toggle button",
)

# 9) Label
rep(
    "{mode === 'coordinator' ? 'ENTER STUDENT COORDINATOR USN *' : 'ENTER UNIQUE REGISTRATION CODE OR USN *'}",
    "{mode === 'faculty' ? 'ENTER FACULTY COORDINATOR FULL NAME *' : mode === 'coordinator' ? 'ENTER STUDENT COORDINATOR USN *' : 'ENTER UNIQUE REGISTRATION CODE OR USN *'}",
    "label",
)

# 10) Placeholder
rep(
    "placeholder={mode === 'coordinator' ? 'e.g. 1SJ24CS145' : 'e.g. TECH26-MWI-8427 or 1SJ21CS001'}",
    "placeholder={mode === 'faculty' ? 'e.g. Dr. Murthy DHR' : mode === 'coordinator' ? 'e.g. 1SJ24CS145' : 'e.g. TECH26-MWI-8427 or 1SJ21CS001'}",
    "placeholder",
)

io.open(path, "w", encoding="utf-8").write(s)
print("\nDONE. bytes %d -> %d" % (len(orig), len(s)))
