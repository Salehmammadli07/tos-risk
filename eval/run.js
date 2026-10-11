import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { analyzeDocument } from '../src/core/analyze.js';
import { createGeminiClient, DEFAULT_MODEL } from '../src/core/llm.js';
import { normalize } from '../src/core/text.js';
import { matchClauses } from './match.js';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY gerekli.');
  process.exit(1);
}
const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
const complete = createGeminiClient({ apiKey, model });
const sources = JSON.parse(readFileSync('eval/sources.json', 'utf8'));
mkdirSync('eval/out', { recursive: true });

const rows = [];
for (const s of sources) {
  const text = readFileSync(`eval/docs/${s.id}.txt`, 'utf8');
  const gold = JSON.parse(readFileSync(`eval/gold/${s.id}.json`, 'utf8')).clauses;
  console.log(`Analiz: ${s.name}`);
  const report = await analyzeDocument({ text, complete });
  writeFileSync(`eval/out/${s.id}.json`, JSON.stringify(report, null, 2));
  rows.push({ s, gold, report, m: report.status === 'ok' ? matchClauses(report.clauses, gold, normalize(text)) : null });
}

const pct = (a, b) => (b === 0 ? '—' : `${Math.round((100 * a) / b)}%`);
const ok = rows.filter((r) => r.m);
const sum = (f) => ok.reduce((n, r) => n + f(r), 0);
const C = sum((r) => r.m.caught.length);
const M = sum((r) => r.m.missed.length);
const F = sum((r) => r.m.falseAlarms.length);

const lines = [
  '# Eval sonuçları',
  '',
  `Tarih: ${new Date().toISOString().slice(0, 10)} · Model: \`${model}\` · temperature 0 · tek çalıştırma`,
  '',
  'Eşleşme: aynı kategori ve alıntının metindeki konumu altın alıntıyla örtüşüyor. Doğrulanamayan (metinde bulunamayan) iddialar rapora girmediği için yanlış alarm sayılmaz, ayrı sütunda gösterilir.',
  '',
  '| Belge | Altın | Yakalanan | Kaçırılan | Yanlış alarm | Tekrar | Doğrulanamayan | Skor | Belirsiz |',
  '|---|---|---|---|---|---|---|---|---|',
  ...rows.map(({ s, gold, report, m }) => (m
    ? `| ${s.name} | ${gold.length} | ${m.caught.length} | ${m.missed.length} | ${m.falseAlarms.length} | ${m.duplicates.length} | ${report.unverified.length} | ${report.score} | ${report.uncertain ? 'evet' : 'hayır'} |`
    : `| ${s.name} | ${gold.length} | — | — | — | — | — | analiz başarısız: ${report.error} | — |`)),
  '',
  `**Toplam:** yakalanan ${C}, kaçırılan ${M}, yanlış alarm ${F} · precision ${pct(C, C + F)} · recall ${pct(C, C + M)}`,
  '',
];
for (const { s, m } of ok) {
  lines.push(`## ${s.name}`, '', `Kaynak: ${s.url} (alındı: ${s.retrieved})`, '');
  if (m.missed.length) lines.push('**Kaçırılan:**', ...m.missed.map((x) => `- [${x.category}] "${x.quote}"`), '');
  if (m.falseAlarms.length) lines.push('**Yanlış alarm:**', ...m.falseAlarms.map((x) => `- [${x.category}] "${x.quote}"`), '');
}
writeFileSync('eval/RESULTS.md', lines.join('\n'));
console.log(`precision ${pct(C, C + F)} · recall ${pct(C, C + M)} → eval/RESULTS.md`);
