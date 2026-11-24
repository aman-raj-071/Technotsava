import { copyFileSync, existsSync } from 'node:fs';

// Root index.html is the exact Neo-Brutalism website (yellow brutalist theme).
// Copy root index.html to dist/index.html so Vercel serves the exact same app as localhost.
const from = 'index.html';
const to = 'dist/index.html';

if (existsSync(from)) {
  copyFileSync(from, to);
  console.log('postbuild: copied ' + from + ' -> ' + to);
} else {
  console.error('postbuild: ' + from + ' not found!');
  process.exit(1);
}
