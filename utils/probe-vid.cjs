const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const low = html.toLowerCase();

// Find videography occurrences
let idx = -1, count = 0;
console.log('=== VIDEOGRAPHY occurrences (lowercase) ===');
while ((idx = low.indexOf('videograph', idx + 1)) !== -1) {
  count++;
  console.log(`--- hit ${count} @ byte ${idx}`);
  console.log(html.slice(idx - 400, idx + 300));
}
console.log('total videography hits:', count);

// Search for status fields / registration gating
console.log('\n=== registration/status keywords ===');
for (const kw of ['registrationOpen', 'regOpen', 'isOpen', 'status", ', 'available', 'closed']) {
  let k = -1, n = 0;
  const kLow = kw.toLowerCase();
  while ((k = low.indexOf(kLow, k + 1)) !== -1 && n < 4) {
    console.log(`[${kw}] @ ${k}: ${html.slice(k - 60, k + 80).replace(/\n/g, ' ')}`);
    n++;
  }
}
