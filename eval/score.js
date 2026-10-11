// Kayıtlı bir çalıştırmayı (eval/runs/<etiket>/) API çağırmadan puanlar ve
// eval/results/<etiket>.md yazar. Kullanım: node eval/score.js <etiket>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { normalize } from '../src/core/text.js';
import { matchClauses, matchByParagraph } from './match.js';

const pct = (a, b) => (b === 0 ? '—' : `${Math.round((100 * a) / b)}%`);

export function scoreRun(label, meta = {}) {
  const sources = JSON.parse(readFileSync('eval/sources.json', 'utf8'));
  const rows = sources.map((s) => {
    const text = readFileSync(`eval/docs/${s.id}.txt`, 'utf8');
    const gold = JSON.parse(readFileSync(`eval/gold/${s.id}.json`, 'utf8')).clauses;
    const report = JSON.parse(readFileSync(`eval/runs/${label}/${s.id}.json`, 'utf8'));
    if (report.status !== 'ok') return { s, gold, report };
    return {
      s, gold, report,
      strict: matchClauses(report.clauses, gold, normalize(text)),
      para: matchByParagraph(report.clauses, gold, text),
    };
  });

  const ok = rows.filter((r) => r.strict);
  const total = (key, f) => ok.reduce((n, r) => n + r[key][f].length, 0);
  const summary = (key) => {
    const C = total(key, 'caught');
    const M = total(key, 'missed');
    const F = total(key, 'falseAlarms');
    return { C, M, F, precision: pct(C, C + F), recall: pct(C, C + M) };
  };
  const strict = summary('strict');
  const para = summary('para');
  const unverified = ok.reduce((n, r) => n + r.report.unverified.length, 0);
  const reported = ok.reduce((n, r) => n + r.report.clauses.length + r.report.unverified.length, 0);

  const cells = (m) => `${m.caught.length} | ${m.missed.length} | ${m.falseAlarms.length}`;
  const lines = [
    `# Eval sonuçları — ${label}`,
    '',
    meta.model ? `Model: \`${meta.model}\` · temperature 0 · tek çalıştırma` : '',
    '',
    'İki eşleşme ölçütü:',
    '- **Katı:** aynı kategori ve alıntıların metindeki konumu örtüşüyor.',
    '- **Hüküm:** aynı kategori ve alıntılar aynı paragrafta (aynı hükmün farklı cümlesi de sayılır).',
    '',
    'Doğrulanamayan (metinde bulunamayan) iddialar rapora girmediği için yanlış alarm sayılmaz, ayrı sütunda gösterilir.',
    '',
    '| Belge | Altın | Katı: yakalanan / kaçırılan / yanlış alarm | Hüküm: yakalanan / kaçırılan / yanlış alarm | Doğrulanamayan | Skor | Belirsiz |',
    '|---|---|---|---|---|---|---|',
    ...rows.map(({ s, gold, report, strict: st, para: pa }) => (st
      ? `| ${s.name} | ${gold.length} | ${cells(st)} | ${cells(pa)} | ${report.unverified.length} | ${report.score} | ${report.uncertain ? 'evet' : 'hayır'} |`
      : `| ${s.name} | ${gold.length} | — | — | — | analiz başarısız: ${report.error} | — |`)),
    '',
    `**Katı:** yakalanan ${strict.C}, kaçırılan ${strict.M}, yanlış alarm ${strict.F} · precision ${strict.precision} · recall ${strict.recall}`,
    '',
    `**Hüküm:** yakalanan ${para.C}, kaçırılan ${para.M}, yanlış alarm ${para.F} · precision ${para.precision} · recall ${para.recall}`,
    '',
    `**Doğrulanamayan iddia:** ${unverified} / ${reported} (${pct(unverified, reported)}); bunlar rapora girmedi.`,
    '',
  ];
  for (const { s, report, para: pa } of ok) {
    lines.push(`## ${s.name}`, '', `Kaynak: ${s.url} (alındı: ${s.retrieved})`, '');
    if (pa.missed.length) lines.push('**Kaçırılan (hüküm ölçütü):**', ...pa.missed.map((x) => `- [${x.category}] "${x.quote}"`), '');
    if (pa.falseAlarms.length) lines.push('**Yanlış alarm (hüküm ölçütü):**', ...pa.falseAlarms.map((x) => `- [${x.category}] "${x.quote}"`), '');
    if (report.unverified.length) lines.push('**Doğrulanamayan (rapora girmedi):**', ...report.unverified.map((x) => `- [${x.category}] "${x.quote}"`), '');
  }
  mkdirSync('eval/results', { recursive: true });
  writeFileSync(`eval/results/${label}.md`, lines.join('\n'));
  return { strict, para, unverified, reported };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [label, model] = process.argv.slice(2);
  const r = scoreRun(label, { model });
  console.log(`${label}: katı P ${r.strict.precision} R ${r.strict.recall} · hüküm P ${r.para.precision} R ${r.para.recall} · doğrulanamayan ${r.unverified}/${r.reported}`);
}
