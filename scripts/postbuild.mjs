// Vite emits the SPA entry to dist/src/index.html (because the input is
// src/index.html). Vercel serves the dist/ dir root, so it needs the entry
// at dist/index.html for "/" to work. Copy it there after every build.
import { copyFileSync, existsSync } from 'node:fs';

const from = 'dist/src/index.html';
const to = 'dist/index.html';

if (existsSync(from)) {
  copyFileSync(from, to);
  console.log('postbuild: ' + from + ' -> ' + to);
} else {
  console.error('postbuild: ' + from + ' not found (did vite build run?)');
  process.exit(1);
}
