const fs = require('fs');
const text = fs.readFileSync('index.html','utf8');
const lines = text.split(/\r?\n/);
const ci = lines.findIndex(l => l.includes('Entry Fee Applicable per Event'));
console.log('card idx', ci);
for (let i = Math.max(0,ci-8); i < Math.min(lines.length, ci+12); i++) {
  process.stdout.write((i+1)+': '+JSON.stringify(lines[i])+'\n');
}
// also list any remaining discount function references
const fn = ['FEE_DISCOUNT_DEADLINE','isFeeDiscountActive','discountedFee','renderFeeAmount','renderFeeLabel','line-through','50% OFF','Flat 50% OFF'];
for (const f of fn) {
  const n = text.split(f).length-1;
  console.log(f, '=>', n);
}
