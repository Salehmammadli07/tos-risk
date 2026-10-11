import cypress from 'cypress';
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const PORT = 5871;
const browser = process.env.CHROME_PATH;
if (!browser) {
  console.error('CHROME_PATH gerekli (Chrome for Testing chrome.exe yolu).');
  process.exit(1);
}

const root = path.resolve('test-pages');
const server = createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  createReadStream(file).pipe(res);
}).listen(PORT);

const spec = process.argv[2] || 'cypress/e2e/demo.cy.js';
const result = await cypress.run({
  browser,
  headed: true,
  spec,
  env: { EXTENSION_DIR: process.env.EXTENSION_DIR || 'dist-test' },
});
server.close();
process.exit(result.status === 'failed' || result.totalFailed > 0 ? 1 : 0);
