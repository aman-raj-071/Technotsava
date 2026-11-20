const fs = require('fs');
const text = fs.readFileSync('index.html','utf8');
const lines = text.split(/\r?\n/);
console.log('TOTAL LINES:', lines.length);
console.log('--- block area (find EARLY) ---');
const bi = lines.findIndex(l => l.includes('EARLY-BIRD'));
console.log('EARLY at idx', bi);
for (let i = Math.max(0,bi-2); i < Math.min(lines.length, bi+52); i++) {
  process.stdout.write((i+1)+': '+JSON.stringify(lines[i])+'\n');
}
console.log('--- card area (find 50% OFF) ---');
const ci = lines.findIndex(l => l.includes('50% OFF'));
console.log('50% OFF at idx', ci);
for (let i = Math.max(0,ci-12); i < Math.min(lines.length, ci+14); i++) {
  process.stdout.write((i+1)+': '+JSON.stringify(lines[i])+'\n');
}
