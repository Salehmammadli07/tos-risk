// Cypress'in demo sırasında aldığı ekran görüntülerini (cypress/screenshots/demo.cy.js/kare-*.png)
// sırayla videoya çevirir: docs/demo.mp4. Her kare ~0,5 sn gösterilir.
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dir = 'cypress/screenshots/demo.cy.js';
const frames = readdirSync(dir).filter((f) => /^kare-\d+\.png$/.test(f)).sort();
if (frames.length === 0) {
  console.error(`${dir} içinde kare yok; önce npm run e2e çalıştırın.`);
  process.exit(1);
}

const SECONDS_PER_FRAME = 0.5;
const list = path.join(dir, 'kareler.txt');
writeFileSync(
  list,
  frames.map((f) => `file '${f}'\nduration ${SECONDS_PER_FRAME}`).join('\n') + `\nfile '${frames.at(-1)}'\n`,
);
mkdirSync('docs', { recursive: true });
execFileSync(ffmpeg.path, [
  '-y', '-loglevel', 'error',
  '-f', 'concat', '-safe', '0', '-i', list,
  '-vf', 'scale=1600:-2,format=yuv420p', '-r', '25',
  'docs/demo.mp4',
]);
console.log(`${frames.length} kare → docs/demo.mp4 (~${Math.round(frames.length * SECONDS_PER_FRAME)} sn)`);
