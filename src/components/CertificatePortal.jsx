import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getAllRegistrations, findCoordinatorByUSN } from '../lib/db';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { COORDINATORS } from '../data/coordinators';
import { FACULTY_COORDINATORS } from '../data/facultyCoordinators';

// Module-level caches: these survive re-renders so the large SVG templates and
// the Poppins font are fetched/decoded only once (not on every render).
const svgTemplateCache = {};
const templateBytesCache = {};
let fontPromiseCache = null;
let fontRegistered = false;

export const CertificatePortal = ({ onBackToFest, initialMode = 'participation' }) => {
  const [mode, setMode] = useState(initialMode === 'coordinator' || initialMode === 'faculty' ? initialMode : 'participation');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [teamRecord, setTeamRecord] = useState(null);
  const [membersList, setMembersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState('');

  const canvasRef = useRef(null);
  const templateImgRef = useRef(null);

  // Preload certificate template
  useEffect(() => {
    const img = new Image();
    img.src = '/certificate-template.svg';
    img.onload = () => { templateImgRef.current = img; };
  }, []);

  // Check URL query param e.g. #certificate?key=... or #certificate?mode=coordinator
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1];
      const params = new URLSearchParams(queryStr);
      const m = params.get('mode');
      if (m === 'coordinator' || m === 'faculty') {
        setMode(m);
      }
      const k = params.get('key') || params.get('usn');
      if (k) {
        setQuery(k);
        fetchCertificates(k);
      }
    }
  }, []);

  // Base template coordinate space (matches /certificate-template.svg).
  // Dimensions are derived from the image itself (2400 x 1696); do NOT
  // hardcode a different size so a higher-res drop-in template just works.
  const BASE_W = 2400;
  const BASE_H = 1696;
  // The template is 2400×1696. We render at native resolution (never upscale)
  // so the raster background stays pixel-sharp; CSS downscales the preview to
  // the container width, and the exported PNG is written at full native size.
  const PREVIEW_SCALE = 1;  // native 2400×1696 — CSS downscaled for display
  const PNG_SCALE = 1;      // native 2400×1696 — full-source PNG export

  // Wait for the display fonts so text is measured & drawn with real metrics.
  // Register the LOCAL TTF via FontFace so the canvas always uses the real
  // Poppins-Medium glyphs (independent of the Google Fonts CDN), which keeps
  // both the metrics and the rendered strokes crisp and consistent.
  const ensureFonts = async () => {
    try {
      if (!fontRegistered) {
        const face = new FontFace('Poppins', 'url(/fonts/Poppins-Medium.ttf)', {
          weight: '500',
          style: 'normal',
          display: 'swap'
        });
        await face.load();
        document.fonts.add(face);
        fontRegistered = true;
      }
      await document.fonts.load('500 50px "Poppins"');
      await document.fonts.load('500 22px "Poppins"');
    } catch (e) {
      /* fall back to system sans-serif */
    }
  };

  // Fit + draw text centered on a baseline, shrinking until it fits maxW.
  const fitText = (ctx, text, cx, baseline, maxW, initialSize, scale = 1) => {
    const s = scale;
    let size = initialSize * s;
    ctx.font = `500 ${size}px 'Poppins', sans-serif`;
    while (ctx.measureText(text).width > maxW * s && size > 20 * s) {
      size -= 1;
      ctx.font = `500 ${size}px 'Poppins', sans-serif`;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, cx * s, baseline * s);
  };

  // ---------------------------------------------------------------------
  // CERTIFICATE GEOMETRY (matches /certificate-template.svg)
  // The SVG template is 1200×848; canvas renders at 2400×1696 (2×).
  // Both name and college are centred horizontally at x=600 (SVG).
  //   name   -> SVG x=600, y=515  → canvas cx=1200, baseline=1030
  //   college is a tspan inside "from <college> has..." at y=558
  //     but the PDF needs to position it separately.
  //   college -> SVG x=600, y=558  → canvas cx=1200, baseline=1116
  // On the 1200×848 pt PDF page, pdf-lib y goes bottom-up:
  //   name    baseline = 848 - 515 = 333  (cx = 600)
  //   college baseline = 848 - 558 = 290  (cx = 600)
  // ---------------------------------------------------------------------
  const NAME_CX = 1200;       // 2× of SVG x=600
  const COLLEGE_CX = 1200;    // 2× of SVG x=600
  const NAME_BASELINE = 1030; // 2× of SVG y=515
  const COLLEGE_BASELINE = 1116; // 2× of SVG y=558
  const TEXT_MAXW = 460;       // max width in 2× canvas px
  const TEXT_COLOR = '#4A1518'; // rgb(0.29, 0.08, 0.09)

  // ---------------------------------------------------------------------
  // COORDINATOR / PARTICIPATION BODY TEXT
  // ---------------------------------------------------------------------
  // Swap body phrases for the Student Coordinator certificate (same layout
  // as the participation certificate, coordinator wording). Each phrase
  // occurs exactly once in /certificate-template.svg.
  const applyModeText = (svg) => {
    if (mode !== 'coordinator') return svg;
    return svg
      .replace(
        'has actively participated in the Events',
        'has served as a Student Co-ordinator for the Events'
      )
      .replace(
        'We appreciate your outstanding performance and dedication.',
        'We appreciate your outstanding contribution, commitment and dedication.'
      );
  };

  // ---------------------------------------------------------------------
  // PREMIUM VECTOR BACKGROUND (replaces the low-res 1024×723 raster that
  // used to be embedded in the SVG and got upscaled -> blur).
  // Drawn with canvas primitives, it is razor-sharp at any resolution.
  // ---------------------------------------------------------------------
  const drawPremiumBackground = (ctx, W, H) => {
    const w = W;
    const h = H;

    // 1) Ivory base with a soft vertical gradient for depth.
    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, '#FDFAF2');
    base.addColorStop(0.5, '#F9F2E3');
    base.addColorStop(1, '#F3E8D2');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // 2) Subtle radial vignette to lift the centre.
    const centerX = w * 0.5;
    const centerY = h * 0.5;
    const vign = ctx.createRadialGradient(centerX, centerY, h * 0.15, centerX, centerY, h * 0.75);
    vign.addColorStop(0, 'rgba(255,255,255,0.55)');
    vign.addColorStop(1, 'rgba(120,80,20,0.10)');
    ctx.fillStyle = vign;
    ctx.fillRect(0, 0, w, h);

    // 3) Outer gold frame + inner fine line + corner filigree.
    const gold = '#C9A227';
    const goldLight = '#E6C76A';
    const crimson = '#7B1E24';
    const m = w * 0.028; // margin

    ctx.strokeStyle = gold;
    ctx.lineWidth = Math.max(1.5, w * 0.0035);
    ctx.strokeRect(m * 0.5, m * 0.5, w - m, h - m);

    ctx.strokeStyle = goldLight;
    ctx.lineWidth = Math.max(0.8, w * 0.0012);
    ctx.strokeRect(m, m, w - m * 2, h - m * 2);

    ctx.strokeStyle = crimson;
    ctx.lineWidth = Math.max(0.6, w * 0.001);
    ctx.strokeRect(m * 1.35, m * 1.35, w - m * 2.7, h - m * 2.7);

    // Corner ornaments: a small gold diamond at each of the four corners.
    const corner = (cx, cy) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = gold;
      ctx.beginPath();
      const s = w * 0.0075;
      ctx.rect(-s, -s, s * 2, s * 2);
      ctx.fill();
      ctx.fillStyle = crimson;
      ctx.beginPath();
      const s2 = s * 0.42;
      ctx.rect(-s2, -s2, s2 * 2, s2 * 2);
      ctx.fill();
      ctx.restore();
    };
    corner(m * 1.05, m * 1.05);
    corner(w - m * 1.05, m * 1.05);
    corner(m * 1.05, h - m * 1.05);
    corner(w - m * 1.05, h - m * 1.05);
  };

  // Draw the premium vector background + SVG decorative overlays + text.
  // We use separate SVG templates for Participant vs Student Coordinator to ensure
  // exact layout, distinct wording, and zero interference with participant certificates.
  const getSvgTemplateText = async (targetMode = mode) => {
    if (!svgTemplateCache[targetMode]) {
      const templateFile =
        targetMode === 'coordinator' || targetMode === 'faculty'
          ? '/certificate-coordinator-template.svg'
          : '/certificate-template.svg';
      const res = await fetch(templateFile);
      svgTemplateCache[targetMode] = await res.text();
    }
    return svgTemplateCache[targetMode];
  };

  // Swap the coordinator template's wording for Faculty Coordinators.
  const applyFacultyModeText = (svg) =>
    svg.replace(
      'has served as a Student Co-ordinator for the Events',
      'has served as a Faculty Co-ordinator for the Events'
    );

  const drawCertificateToCanvas = async (canvas, member, scale) => {
    const W = Math.round(BASE_W * scale);
    const H = Math.round(BASE_H * scale);
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const rawSvg = await getSvgTemplateText(mode);
    const name = member.name || (mode === 'coordinator' ? 'Coordinator' : mode === 'faculty' ? 'Faculty Coordinator' : 'Participant');
    const college = member.college || 'SJC Institute Of Technology';

    // Strip the low-res <image id="cert-bg"> raster from the SVG body.
    let bodySvg = rawSvg.replace(
      /<image\s+id="cert-bg"[^>]*\/>/,
      ''
    );
    if (mode === 'faculty') {
      bodySvg = applyFacultyModeText(bodySvg);
    }

    let filledSvg = bodySvg;
    const nameY = mode === 'coordinator' || mode === 'faculty' ? '508' : '515';
    filledSvg = filledSvg.replace(
      /<text id="name"[^>]*><\/text>/,
      `<text id="name" x="600" y="${nameY}" font-family="Poppins" font-size="24" font-weight="700" fill="#4A1518" text-anchor="middle">${name}</text>`
    );
    filledSvg = filledSvg.replace(
      /<tspan id="college-tspan"[^>]*><\/tspan>/,
      `<tspan id="college-tspan" font-weight="700" fill="#8A5A12">${college}</tspan>`
    );

    // 1) Draw the premium vector background first.
    drawPremiumBackground(ctx, W, H);

    // 2) Layer the SVG decorative overlays (crest, logos, seal, signatures,
    //    underlines, ornaments — no raster background) on top.
    const blob = new Blob([filledSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await img.decode();
    ctx.drawImage(img, 0, 0, W, H);
    URL.revokeObjectURL(url);
  };

  // ---- pdf-lib VECTOR-TEXT export (crisp at any zoom, selectable) ----
  const getPoppinsFont = () => {
    if (!fontPromiseCache) {
      fontPromiseCache = fetch('/fonts/Poppins-Medium.ttf')
        .then((r) => {
          if (!r.ok) throw new Error('Font failed to load');
          return r.arrayBuffer();
        })
        .catch((e) => {
          fontPromiseCache = null;
          throw e;
        });
    }
    return fontPromiseCache;
  };

  const getTemplateBytes = async () => {
    // The PDF background is the same premium vector design + decorative SVG
    // overlays (crest, logos, seal, signatures) as the canvas preview,
    // rasterized at full native resolution into a real JPEG. The cache is
    // keyed by mode so participation/coordinator use their dedicated files.
    if (!templateBytesCache[mode]) {
      const rawSvg = await getSvgTemplateText(mode);
      let bodySvg = rawSvg.replace(/<image\s+id="cert-bg"[^>]*\/>/, '');
      if (mode === 'faculty') {
        bodySvg = applyFacultyModeText(bodySvg);
      }
      if (mode === 'coordinator' || mode === 'faculty') {
        bodySvg = bodySvg.replace(
          /<tspan id="college-tspan"[^>]*><\/tspan>/,
          `<tspan id="college-tspan" font-weight="700" fill="#8A5A12">SJC Institute Of Technology</tspan>`
        );
      }
      const blob = new Blob([bodySvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const overlay = new Image();
      overlay.src = url;
      await overlay.decode();

      const off = document.createElement('canvas');
      off.width = BASE_W;
      off.height = BASE_H;
      const octx = off.getContext('2d');
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      drawPremiumBackground(octx, BASE_W, BASE_H);
      octx.drawImage(overlay, 0, 0, BASE_W, BASE_H);
      URL.revokeObjectURL(url);

      const res = await fetch(off.toDataURL('image/jpeg', 0.92));
      templateBytesCache[mode] = await res.arrayBuffer();
    }
    return templateBytesCache[mode];
  };

  // Build a vector-text PDF (1200 x 848 pt landscape) for one member.
  const buildVectorPdf = async (member) => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const [templateBytes, fontBytes] = await Promise.all([
      getTemplateBytes(),
      getPoppinsFont()
    ]);
    const templateImage = await pdfDoc.embedJpg(templateBytes);
    const font = await pdfDoc.embedFont(fontBytes);

    const pageW = 1200;
    const pageH = 848;
    const page = pdfDoc.addPage([pageW, pageH]);

    // Template full-bleed (vector-free background image).
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: pageW,
      height: pageH
    });

    const color = rgb(0.29, 0.08, 0.09);
    const drawCenteredAt = (text, cx, baselineFromTop, maxW, initialSize) => {
      let size = initialSize;
      while (size > 10 && font.widthOfTextAtSize(text, size) > maxW) {
        size -= 1;
      }
      const width = font.widthOfTextAtSize(text, size);
      // pdf-lib y is bottom-up, so y = pageH - svgY
      page.drawText(text, {
        x: cx - width / 2,
        y: pageH - baselineFromTop,
        size,
        font,
        color
      });
    };

    // Name position:
    const nameBaseline = mode === 'coordinator' || mode === 'faculty' ? 508 : 515;
    drawCenteredAt(member.name || (mode === 'coordinator' ? 'Coordinator' : mode === 'faculty' ? 'Faculty Coordinator' : 'Participant'), 600, nameBaseline, 240, 24);

    const bytes = await pdfDoc.save();
    return bytes;
  };

  const downloadVectorPdf = async (target) => {
    if (!target) return;
    try {
      const bytes = await buildVectorPdf(target);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = (target.name || 'certificate').replace(/\s+/g, '_');
      a.download = `Certificate_${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      alert('Failed to generate the PDF. Please check the browser console.');
    }
  };

  const renderCertificate = async (member) => {
    if (!member) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsRendering(true);
    try {
      await ensureFonts();
      await drawCertificateToCanvas(canvas, member, PREVIEW_SCALE);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (selectedMember) {
      renderCertificate(selectedMember);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMember, mode]);

  const fetchCertificates = async (searchKey) => {
    const key = (searchKey || query).trim();
    if (!key) return;

    setErrorMsg('');
    setSuccessMsg('');
    setTeamRecord(null);
    setMembersList([]);
    setSelectedMember(null);
    setLoading(true);

    const cleanKey = key.toLowerCase();

    // ── Faculty Coordinator mode: look up by NAME (case-insensitive) ──
    if (mode === 'faculty') {
      const normName = (s) =>
        String(s || '').toLowerCase()
          .replace(/\b(dr|mrs|mr|prof|ms)\b\.?/g, '')
          .replace(/[^a-z0-9]/g, '');
      const nKey = normName(key);
      if (!nKey || nKey.length < 2) {
        setErrorMsg('Please enter at least 2 characters of the Faculty Coordinator name.');
        setLoading(false);
        return;
      }
      const scored = FACULTY_COORDINATORS.map((f) => {
        const fn = normName(f.name);
        let score = 0;
        if (fn === nKey) score = 100;
        else if (fn.startsWith(nKey)) score = 80;
        else if (nKey.startsWith(fn)) score = 70;
        else if (fn.includes(nKey) || nKey.includes(fn)) score = 60;
        return { f, score };
      }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
      if (!scored.length) {
        setErrorMsg(`No Faculty Coordinator record found for name "${key}". Please check the spelling.`);
        setLoading(false);
        return;
      }
      const best = scored[0];
      const ties = scored.filter((x) => x.score === best.score);
      if (ties.length > 1 && best.score < 100) {
        setErrorMsg(`Multiple Faculty Coordinators match "${key}": ${ties.map((t) => t.f.name).slice(0, 3).join(', ')}. Please type more of the full name.`);
        setLoading(false);
        return;
      }
      const found = best.f;
      const member = {
        id: 'faculty',
        name: found.name,
        usn: found.department || found.designation || 'Faculty',
        role: 'Faculty Coordinator',
        designation: found.designation,
        college: 'SJC Institute Of Technology',
        event: 'Technotsava 8.0',
        serial: 'CERT-TECH26-FAC-01',
        faculty: true
      };
      const record = {
        reg_id: `FAC-TECH26-${cleanKey.replace(/[^a-z0-9]/g, '')}`,
        leader_name: found.name,
        leader_usn: found.department || found.designation,
        event_name: 'Faculty Coordinator',
        team_name: found.name,
        attended: true
      };
      setTeamRecord(record);
      setMembersList([member]);
      setSelectedMember(member);
      setSuccessMsg(`Verified! Faculty Coordinator certificate available for ${found.name}.`);
      setLoading(false);
      return;
    }

    // ── Student Coordinator mode: look up by USN in coordinators list/db ──
    if (mode === 'coordinator') {
      const coord = (await findCoordinatorByUSN(cleanKey)) || COORDINATORS.find(
        (c) => String(c.usn || '').toLowerCase() === cleanKey
      );
      if (!coord) {
        setErrorMsg(`No Student Coordinator record found for USN "${key}". Please check your USN.`);
        setLoading(false);
        return;
      }
      const member = {
        id: 'coordinator',
        name: coord.name,
        usn: coord.usn,
        role: 'Student Coordinator',
        college: 'SJC Institute Of Technology',
        event: 'Technotsava 8.0',
        serial: 'CERT-TECH26-COORD-01',
        coordinator: true
      };
      const record = {
        reg_id: `COORD-TECH26-${cleanKey}`,
        leader_name: coord.name,
        leader_usn: coord.usn,
        event_name: 'Student Coordinator',
        team_name: coord.name,
        attended: true
      };
      setTeamRecord(record);
      setMembersList([member]);
      setSelectedMember(member);
      setSuccessMsg(`Verified! Student Coordinator certificate available for ${coord.name}.`);
      setLoading(false);
      return;
    }

    try {
      const allRegs = (await getAllRegistrations()) || [];
      const match = allRegs.find((r) => {
        const regId = (r.reg_id || '').toLowerCase();
        const leaderUsn = (r.leader_usn || '').toLowerCase();
        const allUsns = (r.all_usns || []).map((u) => String(u).toLowerCase());
        return regId === cleanKey || leaderUsn === cleanKey || allUsns.includes(cleanKey);
      });

      if (!match) {
        setErrorMsg(`No registration record found for "${key}". Please check your Registration ID or USN.`);
        setLoading(false);
        return;
      }

      if (!match.attended) {
        setErrorMsg(`Registration found for ${match.leader_name || 'Team'}, but attendance has NOT been marked by coordinators yet.`);
        setLoading(false);
        return;
      }

      const collegeName = match.college || 'S J C Institute of Technology';
      const regSuffix = String(match.reg_id || '').split('-').pop() || '0000';
      const members = [];

      // Leader
      if (match.leader_name) {
        members.push({
          id: 'leader',
          name: match.leader_name,
          usn: match.leader_usn || 'N/A',
          role: 'Team Leader',
          college: collegeName,
          event: match.event_name,
          serial: `CERT-TECH26-${regSuffix}-01`
        });
      }

      // Members
      if (Array.isArray(match.members) && match.members.length > 0) {
        match.members.forEach((m, idx) => {
          if (m && (m.name || m.usn)) {
            members.push({
              id: `member-${idx + 1}`,
              name: m.name || `Team Member ${idx + 1}`,
              usn: m.usn || 'N/A',
              role: `Team Member ${idx + 1}`,
              college: collegeName,
              event: match.event_name,
              serial: `CERT-TECH26-${regSuffix}-${String(idx + 2).padStart(2, '0')}`
            });
          }
        });
      }

      setTeamRecord(match);
      setMembersList(members);

      let defaultSelect = members[0];
      const matchedByUsn = members.find(m => String(m.usn).toLowerCase() === cleanKey);
      if (matchedByUsn) {
        defaultSelect = matchedByUsn;
      }
      setSelectedMember(defaultSelect);

      setSuccessMsg(`Verified! ${members.length} member certificate${members.length > 1 ? 's' : ''} available.`);
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSinglePdf = (member) => {
    const target = member || selectedMember;
    if (!target) return;
    downloadVectorPdf(target);
  };

  // Render at the template's FULL native resolution (2400 x 1696) and
  // export PNG directly from that canvas (never a screenshot of the preview).
  const handleDownloadSinglePng = async (member) => {
    const target = member || selectedMember;
    if (!target) return;
    try {
      await ensureFonts();
      const off = document.createElement('canvas');
      await drawCertificateToCanvas(off, target, PNG_SCALE); // native×3 (7200x5088)
      const a = document.createElement('a');
      a.href = off.toDataURL('image/png', 0.95);
      const cleanName = (target.name || 'certificate').replace(/\s+/g, '_');
      a.download = `${cleanName}_TECHNOTSAVA2026_Certificate.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to generate the PNG.');
    }
  };

  const handleDownloadAllZip = async () => {
    if (!membersList || membersList.length === 0) return;

    if (!window.JSZip) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => runZipGeneration();
      document.body.appendChild(script);
    } else {
      runZipGeneration();
    }
  };

  const runZipGeneration = async () => {
    setDownloadingZip(true);
    setZipProgress(`Preparing certificates for ${membersList.length} members...`);

    try {
      const zip = new window.JSZip();

      for (let i = 0; i < membersList.length; i++) {
        const m = membersList[i];
        setZipProgress(`Creating (${i + 1}/${membersList.length}): ${m.name}`);

        const pdfBytes = await buildVectorPdf(m);
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        zip.file(`${i + 1}_${m.name.replace(/\s+/g, '_')}_${(m.usn || '').replace(/\s+/g, '_')}.pdf`, pdfBlob);
      }

      setZipProgress('Packaging ZIP bundle...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      const regName = (teamRecord?.reg_id || 'Team').replace(/\s+/g, '_');
      a.download = `Technotsava_Certificates_${regName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);

      setZipProgress('Done!');
      setTimeout(() => {
        setDownloadingZip(false);
        setZipProgress('');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to generate ZIP.');
      setDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center">
      {/* Mode Toggle */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <button
          onClick={() => { setMode('participation'); setQuery(''); setErrorMsg(''); setSuccessMsg(''); setTeamRecord(null); setMembersList([]); setSelectedMember(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${mode === 'participation'
            ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400'
            }`}
        >
          🏅 Participation Certificate
        </button>
        <button
          onClick={() => { setMode('coordinator'); setQuery(''); setErrorMsg(''); setSuccessMsg(''); setTeamRecord(null); setMembersList([]); setSelectedMember(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${mode === 'coordinator'
            ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400'
            }`}
        >
          🎓 Student Coordinator Certificate
        </button>
        <button
          onClick={() => { setMode('faculty'); setQuery(''); setErrorMsg(''); setSuccessMsg(''); setTeamRecord(null); setMembersList([]); setSelectedMember(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${mode === 'faculty'
            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-amber-500/40 hover:text-amber-400'
            }`}
        >
          👩‍🏫 Faculty Coordinator Certificate
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 mb-3 text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-950/60 border border-cyan-500/30 rounded-full">
          {mode === 'faculty' ? 'Official Faculty Certification' : mode === 'coordinator' ? 'Official Coordinator Certification' : 'Official Team & Member Certification'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {mode === 'faculty' ? 'Claim Faculty Coordinator Certificate' : mode === 'coordinator' ? 'Claim Student Coordinator Certificate' : 'Claim Participation Certificates'}
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          {mode === 'faculty' ? (
            <>
              Enter your <span className="text-amber-400 font-mono">Full Name</span> to fetch your Faculty Coordinator certificate.
            </>
          ) : mode === 'coordinator' ? (
            <>
              Enter your <span className="text-cyan-400 font-mono">USN</span> to fetch your Student Coordinator certificate.
            </>
          ) : (
            <>
              Enter your <span className="text-cyan-400 font-mono">Unique Registration Code</span> (e.g. TECH26-...) or <span className="text-cyan-400 font-mono">USN</span> to fetch certificates for all registered team members.
            </>
          )}
        </p>
      </div>

      {/* Input Form */}
      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
        <form onSubmit={(e) => { e.preventDefault(); fetchCertificates(); }} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'faculty' ? 'Enter Faculty Name' : mode === 'coordinator' ? 'Enter USN' : 'Enter Registration Code or USN'}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 font-mono text-sm uppercase outline-none transition-all shadow-inner"
              required
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>{mode === 'faculty' ? 'Fetch Faculty Certificate' : mode === 'coordinator' ? 'Fetch Coordinator Certificate' : 'Fetch All Certificates'}</span>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span>⚠</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <span>✔</span>
            <span>{successMsg}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={onBackToFest}
            className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            ← Back to Home
          </button>
          <a
            href="/certificate.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
          >
            Open Standalone Page ↗
          </a>
        </div>
      </div>

      {/* TEAM MEMBERS INTERACTIVE HUB */}
      {teamRecord && membersList.length > 0 && (
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          {/* Team Info Card with Bulk ZIP Download */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/40">
                    {teamRecord.reg_id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/40">
                    Attended & Verified
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {teamRecord.team_name || `${teamRecord.leader_name}'s Team`}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Event: <strong className="text-slate-200">{teamRecord.event_name}</strong> • Total Members: <strong className="text-slate-200">{membersList.length}</strong>
                </p>
              </div>

              {membersList.length > 1 && (
                <button
                  onClick={handleDownloadAllZip}
                  disabled={downloadingZip}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>📦</span>
                  <span>{downloadingZip ? (zipProgress || 'Generating ZIP...') : `Download All (${membersList.length} Certificates .ZIP)`}</span>
                </button>
              )}
            </div>

            {/* Member Selector Cards */}
            <div className="mt-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Select Member to Preview & Download:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {membersList.map((m) => {
                  const isSelected = selectedMember?.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-1 ring-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className={isSelected ? 'text-cyan-300 font-bold' : 'text-slate-500'}>{m.role}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                      </div>
                      <div className="font-semibold text-sm text-white truncate mb-1" title={m.name}>
                        {m.name}
                      </div>
                      <div className="font-mono text-xs text-slate-400">
                        USN: <span className="text-slate-200">{m.usn}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Certificate Live Preview & Download Card */}
          <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Live Preview</span>
                <span className="text-xs text-slate-400 ml-2">
                  for <strong className="text-white underline">{selectedMember?.name}</strong> ({selectedMember?.usn})
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleDownloadSinglePng(selectedMember)}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <span>🖼️</span>
                  <span>PNG (300 DPI)</span>
                </button>
                <button
                  onClick={() => handleDownloadSinglePdf(selectedMember)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <span>📥</span>
                  <span>Download {selectedMember?.name?.split(' ')[0]}'s PDF</span>
                </button>
              </div>
            </div>

            <div className="relative overflow-x-auto flex justify-center bg-black/40 p-2 rounded-xl border border-slate-800">
              {isRendering && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-xs text-cyan-400 font-mono">
                  Rendering certificate...
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-lg shadow-2xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
