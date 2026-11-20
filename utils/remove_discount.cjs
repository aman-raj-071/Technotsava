const fs = require('fs');
const p = 'index.html';
let text = fs.readFileSync(p, 'utf8');
// preserve dominant EOL
const crlf = (text.match(/\r\n/g) || []).length;
const lf = (text.match(/(?<!\r)\n/g) || []).length;
const eol = crlf >= lf ? '\r\n' : '\n';
let lines = text.split(/\r?\n/);

// ---- 1. Remove discount helper block (original 1-based lines 1390..1440) ----
const blockStart = lines.findIndex(l => l.includes('EARLY-BIRD 50% FEE DISCOUNT'));
console.log('blockStartIdx:', blockStart);
let blockEnd = -1;
for (let i = blockStart; i < lines.length; i++) {
  if (lines[i].trim() === 'function renderFeeLabel(label)') {
    // find its closing brace line
    for (let j = i; j < lines.length; j++) {
      if (lines[j].trim() === '}') { blockEnd = j; break; }
    }
    break;
  }
}
console.log('blockEndIdx:', blockEnd);
if (blockStart >= 0 && blockEnd > blockStart) {
  // also remove the blank line(s) after
  let end = blockEnd;
  if (lines[end + 1] !== undefined && lines[end + 1].trim() === '') end++;
  lines.splice(blockStart, end - blockStart + 1);
  console.log('Removed block lines', blockStart + 1, 'through', end + 1);
} else {
  console.log('!! Block not found cleanly');
}

text = lines.join(eol);

// ---- 2. Replace Event Entry promo card (original 1-based 1157..1171) ----
const oldCard = `<div className="relative bg-gradient-to-br from-[#FFF2C6] to-[#FFDF7E] border-3 border-black brutal-shadow-sm p-4 flex items-center gap-3 overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_20%,rgba(242,183,5,0.45),transparent_60%)]" />
                <div className="relative w-10 h-10 bg-[#00A878] border-2 border-black flex items-center justify-center font-bold text-xl">🎟️</div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="text-[11px] font-mono uppercase font-bold text-black">Event Entry</div>
                    <span className="px-1.5 py-0.5 bg-[#F2B705] border border-black rounded-sm text-[9px] font-black uppercase tracking-wide text-black animate-pulse">⚡ 50% OFF</span>
                  </div>
                  <div className="text-sm font-bold text-black">Entry Fee Applicable per Event</div>
                  <div className="mt-1 text-[11px] font-extrabold text-orange-700 leading-tight">
                    🎉 Flat 50% OFF on registration fees!
                    <span className="block text-[10px] font-semibold text-slate-700 mt-0.5">Valid until 20 November, 4:00 PM IST.</span>
                  </div>
                </div>
              </div>`;
const newCard = `<div className="bg-white border-3 border-black brutal-shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F2B705] border-2 border-black flex items-center justify-center font-bold text-xl">🎟️</div>
                <div>
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-600">Event Entry</div>
                  <div className="text-sm font-bold text-black">Entry Fee Applicable per Event</div>
                </div>
              </div>`;
const cardCount = text.split(oldCard).length - 1;
console.log('oldCard matches:', cardCount);
if (cardCount >= 1) text = text.split(oldCard).join(newCard);

// ---- 3. Fee display reverts ----
const subs = [
  ["💰 {renderFeeLabel(event.entryFeeText || 'Entry Fee Applicable')}", "💰 {event.entryFeeText || 'Entry Fee Applicable'}"],
  ["💰 {renderFeeLabel(event.entryFeeText)}", "💰 {event.entryFeeText}"],
  ["INDIVIDUAL — {renderFeeAmount('₹100')}", "INDIVIDUAL — ₹100"],
  ["PAIR — {renderFeeAmount('₹150')}", "PAIR — ₹150"],
  ["INDIVIDUAL — {renderFeeAmount('₹50')}", "INDIVIDUAL — ₹50"],
  ["TEAM (2–4) — {renderFeeAmount('₹200')}", "TEAM (2–4) — ₹200"],
  ["{renderFeeAmount(paidAmount)}", "{paidAmount}"],
  ["{renderFeeAmount(getRecordFee(r))}", "{getRecordFee(r)}"],
  ["{renderFeeAmount(getRecordFee(viewModal))}", "{getRecordFee(viewModal)}"],
];
for (const [a, b] of subs) {
  const n = text.split(a).length - 1;
  console.log('sub:', JSON.stringify(a.slice(0,30)), '=>', n);
  if (n >= 1) text = text.split(a).join(b);
}

fs.writeFileSync(p, text, 'utf8');
console.log('WROTE file length:', text.length);
