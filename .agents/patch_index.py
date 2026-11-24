# -*- coding: utf-8 -*-
# Surgical patch of the standalone index.html (live/served app) to add a
# Student Coordinator certificate mode alongside the existing participation mode.
import io

PATH = 'index.html'
with open(PATH, encoding='utf-8', errors='replace') as f:
    d = f.read()

def replace_once(old, new, must_exist=True):
    global d
    n = d.count(old)
    if must_exist and n != 1:
        raise SystemExit(f'ANCHOR FAILED ({n} hits): {old[:80]!r}')
    if n == 0:
        return
    d = d.replace(old, new, 1)

# ---------------------------------------------------------------------------
# 1) Add coordinator resume + mode state inside CertificatePortal
# ---------------------------------------------------------------------------
replace_once(
    """function CertificatePortal({ onBack }) {
      const [keyInput, setKeyInput] = useState('');
      const [loading, setLoading] = useState(false);
      const [errorMsg, setErrorMsg] = useState('');
      const [successMsg, setSuccessMsg] = useState('');
""",
    """function CertificatePortal({ onBack }) {
      const [mode, setMode] = useState('participation'); // 'participation' | 'coordinator'
      const [keyInput, setKeyInput] = useState('');
      const [loading, setLoading] = useState(false);
      const [errorMsg, setErrorMsg] = useState('');
      const [successMsg, setSuccessMsg] = useState('');
""",
)

# ---------------------------------------------------------------------------
# 2) Preload both templates (participation default) + read mode from hash
# ---------------------------------------------------------------------------
replace_once(
    """      // Preload certificate template image for fast instant switching
      useEffect(() => {
        const img = new Image();
        img.src = '/certificate-template.svg';
        img.onload = () => { templateImgRef.current = img; };
      }, []);

      useEffect(() => {
        const hash = location.hash;
        if (hash.includes('?')) {
          const qs = hash.split('?')[1];
          const sp = new URLSearchParams(qs);
          const k = sp.get('key') || sp.get('usn');
          if (k) {
            setKeyInput(k);
            handleFetch(k);
          }
        }
      }, []);

      const fitText =""",
    """      // Preload certificate template image for fast instant switching
      useEffect(() => {
        const img = new Image();
        img.src = '/certificate-template.svg';
        img.onload = () => { templateImgRef.current = img; };
      }, []);

      useEffect(() => {
        const hash = location.hash;
        if (hash.includes('?')) {
          const qs = hash.split('?')[1];
          const sp = new URLSearchParams(qs);
          const m = sp.get('mode');
          if (m === 'coordinator') setMode('coordinator');
          const k = sp.get('key') || sp.get('usn');
          if (k) {
            setKeyInput(k);
            handleFetch(k);
          }
        }
      }, []);

      const fitText =""",
)

# ---------------------------------------------------------------------------
# 3) Make getSvgTemplate mode-aware (pick participation vs coordinator SVG)
# ---------------------------------------------------------------------------
replace_once(
    """            let svgTemplateCache = null;
      const getSvgTemplate = async () => {
        if (!svgTemplateCache) {
          const res = await fetch('/certificate-template.svg');
          svgTemplateCache = await res.text();
        }
        return svgTemplateCache;
      };
""",
    """            let svgTemplateCache = null;
      let svgCoordTemplateCache = null;
      const getSvgTemplate = async () => {
        const isCoord = mode === 'coordinator';
        if (isCoord) {
          if (!svgCoordTemplateCache) {
            const res = await fetch('/certificate-coordinator-template.svg');
            svgCoordTemplateCache = await res.text();
          }
          return svgCoordTemplateCache;
        }
        if (!svgTemplateCache) {
          const res = await fetch('/certificate-template.svg');
          svgTemplateCache = await res.text();
        }
        return svgTemplateCache;
      };
""",
)

# ---------------------------------------------------------------------------
# 4) Coordinator branch in handleFetch (USN lookup before registration search)
# ---------------------------------------------------------------------------
replace_once(
    """        const cleanKey = k.toLowerCase();

        try {
          const allRegs = await getStoredRegistrations();
""",
    """        const cleanKey = k.toLowerCase();

        // Student Coordinator mode: look up by USN in the coordinator roster
        if (mode === 'coordinator') {
          const found = COORDINATORS.find((c) => String(c.usn).toLowerCase() === cleanKey);
          if (!found) {
            setLoading(false);
            setErrorMsg('No Student Co-ordinator found for "' + k + '". Please check your USN.');
            return;
          }
          const coordMember = {
            id: 'coordinator',
            name: found.name,
            usn: found.usn,
            role: found.role || 'Student Coordinator',
            college: found.college || 'S J C Institute of Technology',
            event: 'Technotsava 8.0'
          };
          setTeamRecord({ reg_id: found.usn, leader_name: found.name, event_name: 'Technotsava 8.0' });
          setMembersList([coordMember]);
          setSelectedMember(coordMember);
          setSuccessMsg('🎉 Verified! Student Co-ordinator certificate ready for ' + found.name + '.');
          setLoading(false);
          if (window.confetti) {
            try { window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
          }
          return;
        }

        try {
          const allRegs = await getStoredRegistrations();
""",
)

# ---------------------------------------------------------------------------
# 5) Dynamic heading + description in JSX
# ---------------------------------------------------------------------------
replace_once(
    """            <h1 className="font-display font-black text-3xl sm:text-5xl text-black uppercase mb-2">
              CLAIM PARTICIPATION CERTIFICATES
            </h1>
            <p className="font-mono text-xs sm:text-sm text-slate-700 max-w-3xl">
              Enter your <span className="font-bold text-black underline">Unique Registration Code</span> (e.g. TECH26-...) or <span className="font-bold text-black underline">USN</span>. If your team attended, certificates for <strong>all team members</strong> will be fetched and ready to preview or download!
            </p>
""",
    """            <h1 className="font-display font-black text-3xl sm:text-5xl text-black uppercase mb-2">
              {mode === 'coordinator' ? 'CLAIM STUDENT COORDINATOR CERTIFICATE' : 'CLAIM PARTICIPATION CERTIFICATES'}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-slate-700 max-w-3xl">
              {mode === 'coordinator' ? (
                <>Enter your <span className="font-bold text-black underline">USN</span>. If you are a registered Student Co-ordinator, your certificate will be fetched and ready to preview or download!</>
              ) : (
                <>Enter your <span className="font-bold text-black underline">Unique Registration Code</span> (e.g. TECH26-...) or <span className="font-bold text-black underline">USN</span>. If your team attended, certificates for <strong>all team members</strong> will be fetched and ready to preview or download!</>
              )}
            </p>
""",
)

# ---------------------------------------------------------------------------
# 6) Mode toggle buttons above the search card
# ---------------------------------------------------------------------------
replace_once(
    """          {/* Search Card */}
          <form onSubmit={(e) => { e.preventDefault(); handleFetch(); }} className="bg-white border-4 border-black brutal-shadow-lg p-6 sm:p-8 mb-8">
""",
    """          {/* Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => { setMode('participation'); setErrorMsg(''); setSuccessMsg(''); }}
              className={mode === 'participation' ? 'px-4 py-2 font-mono font-black text-xs bg-[#00E575] text-black border-3 border-black brutal-shadow-sm' : 'px-4 py-2 font-mono font-black text-xs bg-white text-black border-3 border-black'}
            >
              🏅 PARTICIPATION CERTIFICATE
            </button>
            <button
              onClick={() => { setMode('coordinator'); setErrorMsg(''); setSuccessMsg(''); }}
              className={mode === 'coordinator' ? 'px-4 py-2 font-mono font-black text-xs bg-[#FFE600] text-black border-3 border-black brutal-shadow-sm' : 'px-4 py-2 font-mono font-black text-xs bg-white text-black border-3 border-black'}
            >
              🎓 STUDENT COORDINATOR CERTIFICATE
            </button>
          </div>

          {/* Search Card */}
          <form onSubmit={(e) => { e.preventDefault(); handleFetch(); }} className="bg-white border-4 border-black brutal-shadow-lg p-6 sm:p-8 mb-8">
""",
)

# ---------------------------------------------------------------------------
# 7) Dynamic search label + placeholder
# ---------------------------------------------------------------------------
replace_once(
    """            <label className="block font-mono font-black text-xs uppercase tracking-wider text-black mb-2">
              ENTER UNIQUE REGISTRATION CODE OR USN *
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. TECH26-MWI-8427 or 1SJ21CS001"
""",
    """            <label className="block font-mono font-black text-xs uppercase tracking-wider text-black mb-2">
              {mode === 'coordinator' ? 'ENTER STUDENT COORDINATOR USN *' : 'ENTER UNIQUE REGISTRATION CODE OR USN *'}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={mode === 'coordinator' ? 'e.g. 1SJ24CS145' : 'e.g. TECH26-MWI-8427 or 1SJ21CS001'}
""",
)

# ---------------------------------------------------------------------------
# 8) Footer: add Student Coordinator certificate option next to CLAIM CERTIFICATE
# ---------------------------------------------------------------------------
replace_once(
    """                  <button onClick={() => { setView('certificate'); location.hash = '#certificate'; }} className="underline hover:text-green-800 font-black mr-4">
                    🎓 CLAIM CERTIFICATE ↗
                  </button>
""",
    """                  <button onClick={() => { setView('certificate'); location.hash = '#certificate'; }} className="underline hover:text-green-800 font-black mr-4">
                    🎓 CLAIM CERTIFICATE ↗
                  </button>
                  <button onClick={() => { setView('certificate'); location.hash = '#certificate?mode=coordinator'; }} className="underline hover:text-yellow-700 font-black mr-4">
                    🎓 STUDENT COORDINATOR CERTIFICATE ↗
                  </button>
""",
)

# ---------------------------------------------------------------------------
# 9) Insert COORDINATORS data (top-level, before CertificatePortal)
# ---------------------------------------------------------------------------
replace_once(
    """function CertificatePortal({ onBack }) {
""",
    """const COORDINATORS = [
  { usn: '1SJ24CS145', name: 'Sohan Gowda K', role: 'Main Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS124', name: 'Ruchitha L', role: 'Main Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS022', name: 'Brunda S', role: 'Main Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS061', name: 'Kruthika M G', role: 'Main Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS153', name: 'Tejas J V', role: 'Main Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS153', name: 'Tejas J V', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS024', name: 'Chandushri V M', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS012', name: 'Anusha S', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS126', name: 'Sahithi K N', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS125', name: 'Sahana M', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS123', name: 'Sagar Metri', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS035', name: 'Ganavi V', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS025', name: 'D N Harshitha', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS121', name: 'Sadhvika B R', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS135', name: 'Shashirekha G', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS140', name: 'Shrunga N', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS144', name: 'Sowmya V', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS067', name: 'Likhitha A', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS072', name: 'Madhu P G', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS100', name: 'Poojitha R', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS088', name: 'Nanditha A', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS085', name: 'Namitha A', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS064', name: 'Kusuma B M', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS176', name: 'Vivek P M', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: 'YASHAS-A', name: 'Yashas A', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS127', name: 'Sai Gagan N K', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: 'CHIRAYUSH-TM', name: 'Chirayush T M', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS158', name: 'Uday S Reddy', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS169', name: 'Vidit Raj', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS182', name: 'Yashwanth Gowda R', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS184', name: 'Yogish Gowda S', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS130', name: 'Sandeep N', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS147', name: 'Sudeep R H', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS128', name: 'Samith Gowda', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS138', name: 'Shodhan V Shetty', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS137', name: 'Shivanand Konnur', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS117', name: 'Rohith C S', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS167', name: 'Yashavanth H D', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS118', name: 'Rohith S R', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS003', name: 'Abhishek E', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS017', name: 'Ayiman Tarannum', role: 'Team Lead', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS011', name: 'Aman Raj', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS007', name: 'Afza Farheen A', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS014', name: 'Aniket', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS034', name: 'Chaithanya R', role: 'Student Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS181', name: 'Yashaswini M', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS178', name: 'Vyshnavi P', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS129', name: 'Sanchitha S', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS045', name: 'Haripriya RM', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS026', name: 'Bhavana J', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS043', name: 'G.N Meghana', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS183', name: 'Yathish V', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS103', name: 'Pratham S B', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS132', name: 'Sanika R', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS168', name: 'Vidhya N', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS118', name: 'Riya Singh', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS112', name: 'Rachamalla Kavya', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS113', name: 'Ragi Rakshitha', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS148', name: 'Sumanth Reddy', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS141', name: 'Shreya M', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS173', name: 'Reshika Kirana Kumar', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS009', name: 'Akshay S', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS170', name: 'Vidya Shree D', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ24CS166', name: 'Varsha Tejamayi R', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
  { usn: '1SJ25CS061', name: 'Keerthi Kumar B J', role: 'Publishing Coordinator', college: 'S J C Institute of Technology' },
];

function CertificatePortal({ onBack }) {
""",
)

with open(PATH, 'w', encoding='utf-8', newline='') as f:
    f.write(d)

print('PATCH OK — all anchors matched and applied.')
