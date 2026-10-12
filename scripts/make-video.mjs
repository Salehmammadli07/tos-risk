// Cypress'in demo sırasında aldığı ekran görüntülerini (cypress/screenshots/demo.cy.js/kare-*.png)
// sırayla videoya çevirir: docs/demo.mp4.
// Kareler ffmpeg'e stdin'den verilir; Windows'ta Türkçe/Kiril karakterli yolları ffmpeg açamıyor.
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const FPS = 1.5;
const dir = 'cypress/screenshots/demo.cy.js';
const frames = readdirSync(dir).filter((f) => /^kare-\d+\.png$/.test(f)).sort();
if (frames.length === 0) {
  console.error(`${dir} içinde kare yok; önce npm run e2e çalıştırın.`);
  process.exit(1);
}

const input = Buffer.concat(frames.map((f) => readFileSync(path.join(dir, f))));
const result = spawnSync(ffmpeg.path, [
  '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', 'pipe:0',
  '-vf', 'scale=1600:-2,format=yuv420p', '-r', '25',
  '-movflags', 'frag_keyframe+empty_moov', '-f', 'mp4', 'pipe:1',
], { input, maxBuffer: 1024 * 1024 * 512 });
if (result.status !== 0) {
  console.error(result.stderr.toString());
  process.exit(1);
}
mkdirSync('docs', { recursive: true });
writeFileSync('docs/demo.mp4', result.stdout);
console.log(`${frames.length} kare → docs/demo.mp4 (~${Math.round(frames.length / FPS)} sn)`);
