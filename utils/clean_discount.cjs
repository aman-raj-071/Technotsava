const fs = require('fs');
const p = 'index.html';
let text = fs.readFileSync(p, 'utf8');
const crlf = (text.match(/\r\n/g) || []).length;
const lf = (text.match(/(?<!\r)\n/g) || []).length;
const eol = crlf >= lf ? '\r\n' : '\n';
let lines = text.split(/\r?\n/);

// 1. remove helper block
const bi = lines.findIndex(l => l.includes('EARLY-BIRD 50% FEE DISCOUNT'));
let endBi = -1;
for (let i = bi; i < lines.length; i++) {
  if (lines[i].trim() === '}' && lines[i + 1] !== undefined && lines[i + 1].trim() === '') { endBi = i; break; }
}
console.log('block', bi, endBi);
if (bi >= 0 && endBi > bi) lines.splice(bi, endBi - bi + 2);
else console.log('!! block failed');

// 2. revert Event Entry card (above block, indices unchanged)
const oldCard = lines.slice(1156, 1171).join(eol);
console.log('card matches', oldCard.includes('bg-gradient-to-br'));
const newCard = [
  '              <div className="bg-white border-3 border-black brutal-shadow-sm p-4 flex items-center gap-3">',
  '                <div className="w-10 h-10 bg-[#00A878] border-2 border-black flex items-center justify-center font-bold text-xl">🎟️</div>',
  '                <div>',
  '                  <div className="text-[11px] font-mono uppercase font-bold text-slate-600">Event Entry</div>',
  '                  <div className="text-sm font-bold text-black">Entry Fee Applicable per Event</div>',
  '                </div>',
  '              </div>'
].join(eol);
if (oldCard.includes('bg-gradient-to-br')) lines.splice(1156, 15, ...newCard.split(eol));
else console.log('!! card failed');

// 3. remove navbar marquee (lines 1033..1041 = idx 1032..1041)
const oldMarquee = lines.slice(1032, 1042).join(eol);
console.log('marquee matches', oldMarquee.includes('marquee-content'));
if (oldMarquee.includes('marquee-content')) lines.splice(1032, 10);
else console.log('!! marquee failed');

text = lines.join(eol);
fs.writeFileSync(p, text, 'utf8');
console.log('WROTE len', text.length);
const t = fs.readFileSync(p, 'utf8');
for (const f of ['EARLY-BIRD', 'isFeeDiscountActive', 'discountedFee', 'renderFeeAmount', 'renderFeeLabel', 'line-through', 'Flat 50% OFF', 'marquee-content', 'bg-gradient-to-br', '50% OFF']) {
  const n = t.split(f).length - 1;
  console.log(f, '=>', n);
  if (n > 0) {
    const i = t.indexOf(f);
    console.log('   ...', JSON.stringify(t.slice(Math.max(0, i - 60), i + 80)));
  }
}
