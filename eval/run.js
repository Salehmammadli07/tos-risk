// Her belgeyi modele sorar, ham raporları eval/runs/<etiket>/ altına yazar ve puanlar.
// Kullanım: GEMINI_API_KEY=... [GEMINI_MODEL=...] [EVAL_LABEL=...] node eval/run.js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { analyzeDocument } from '../src/core/analyze.js';
import { createGeminiClient, DEFAULT_MODEL } from '../src/core/llm.js';
import { scoreRun } from './score.js';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY gerekli.');
  process.exit(1);
}
const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
const label = process.env.EVAL_LABEL || `${new Date().toISOString().slice(0, 10)}-${model}`;
const complete = createGeminiClient({ apiKey, model });
const sources = JSON.parse(readFileSync('eval/sources.json', 'utf8'));
mkdirSync(`eval/runs/${label}`, { recursive: true });

for (const s of sources) {
  const text = readFileSync(`eval/docs/${s.id}.txt`, 'utf8');
  console.log(`Analiz: ${s.name}`);
  const report = await analyzeDocument({ text, complete });
  writeFileSync(`eval/runs/${label}/${s.id}.json`, JSON.stringify(report, null, 2));
}

const r = scoreRun(label, { model });
console.log(`katı P ${r.strict.precision} R ${r.strict.recall} · hüküm P ${r.para.precision} R ${r.para.recall} → eval/results/${label}.md`);
