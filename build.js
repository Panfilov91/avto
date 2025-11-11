const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const outputPath = path.join(distDir, 'index.html');

const htmlPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'styles.css');

const scriptOrder = [
  'js/storage-manager.js',
  'js/directories-module.js',
  'js/order-form-module.js',
  'js/orders-registry-module.js',
  'js/lift-calendar-module.js',
  'js/export-module.js',
  'js/app.js'
];

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

function bundleHtml() {
  ensureFileExists(htmlPath);
  ensureFileExists(cssPath);

  let html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  html = html.replace(
    /<link rel="stylesheet" href="styles\.css">\s*/i,
    `  <style>\n${css}\n  </style>\n`
  );

  const scriptTagPattern = /[ \t]*<script src="js\/[^"]+"><\/script>\s*\n?/g;
  html = html.replace(scriptTagPattern, '');

  const bundle = scriptOrder
    .map((file) => {
      const scriptPath = path.join(rootDir, file);
      ensureFileExists(scriptPath);
      return fs.readFileSync(scriptPath, 'utf8');
    })
    .join('\n\n');

  const sanitizedBundle = bundle.replace(/<\/script>/gi, '<\\/script>');

  html = html.replace(
    '</body>',
    `  <script>\n${sanitizedBundle}\n  </script>\n</body>`
  );

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html, 'utf8');
  return outputPath;
}

try {
  const resultPath = bundleHtml();
  console.log(`Bundled index generated at: ${resultPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
