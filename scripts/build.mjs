import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync } from 'node:fs';

const test = process.argv.includes('--test');
const outdir = test ? 'dist-test' : 'dist';
if (test && !process.env.GEMINI_API_KEY) {
  console.error('build:test için GEMINI_API_KEY ortam değişkeni gerekli.');
  process.exit(1);
}

rmSync(outdir, { recursive: true, force: true });
mkdirSync(outdir);

await esbuild.build({
  entryPoints: {
    content: 'src/extension/content.js',
    background: 'src/extension/background.js',
    popup: 'src/extension/popup.js',
  },
  bundle: true,
  format: 'iife',
  target: 'chrome120',
  outdir,
  define: { __TEST_API_KEY__: JSON.stringify(test ? process.env.GEMINI_API_KEY : '') },
  logLevel: 'info',
});

for (const f of ['manifest.json', 'popup.html']) cpSync(`src/extension/${f}`, `${outdir}/${f}`);
console.log(`Derlendi: ${outdir}/`);
