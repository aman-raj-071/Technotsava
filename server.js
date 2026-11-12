// =========================================================================
// TECHNOTSAV 2026 - Zero-Dependency Local Preview Server (ESM)
// =========================================================================
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Read .env into process.env if available
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Provide injected runtime env script for browser frontend
  if (urlPath === '/env-config.js') {
    const clientEnv = {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '',
      VITE_ADMIN_PASSCODE: process.env.VITE_ADMIN_PASSCODE || 'admin2026'
    };
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(`window.__ENV__ = ${JSON.stringify(clientEnv)};`);
    return;
  }

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/preview.html';
  }

  let filePath = path.join(__dirname, urlPath);

  // If requested path does not exist, fallback to preview.html (SPA routing)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'preview.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Internal Server Error: ${err.message}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 TECHNOTSAV 2026 Web Server is live!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`💡 Admin Portal: http://localhost:${PORT}/#admin`);
  console.log(`   (Default Passcode: admin2026)`);
  console.log(`======================================================\n`);
});
