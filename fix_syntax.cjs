const fs = require('fs');
const parser = require('@babel/parser');

let code = fs.readFileSync('extracted_code.jsx', 'utf8');

const marker = '<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">';
const idx = code.indexOf(marker);
const nextFunc = code.indexOf('function EventsSection');

if (idx !== -1 && nextFunc !== -1) {
  code = code.substring(0, idx) + '\n    // ========================================================\n    // EVENTS SECTION COMPONENT (4 EVENTS)\n    // ========================================================\n    ' + code.substring(nextFunc);
  console.log('Cleaned orphan block!');
}

try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  console.log('AST PARSE SUCCESS: Completely clean JSX!');
  
  // Now write back to preview.html and index.html
  let html = fs.readFileSync('preview.html', 'utf8');
  const startMarker = '<script type="text/babel">';
  const endMarker = '</script>';
  const startIndex = html.indexOf(startMarker);
  const endIndex = html.lastIndexOf(endMarker);
  
  const cleanHtml = html.substring(0, startIndex + startMarker.length) + '\n' + code + '\n  ' + html.substring(endIndex);
  
  fs.writeFileSync('preview.html', cleanHtml, 'utf8');
  fs.writeFileSync('index.html', cleanHtml, 'utf8');
  console.log('Updated preview.html and index.html successfully!');
} catch (err) {
  console.error('Parse error at line', err.loc.line, 'col', err.loc.column, ':', err.message);
}
