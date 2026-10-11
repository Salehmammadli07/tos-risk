import { normalize } from './text.js';

// Kalıplar normalize edilmiş metne uygulanır (küçük harf, ı→i).
const PATTERNS = [
  /ignore (all |any )?(of )?(the |your )?(previous|prior|above|earlier) (instructions|prompts?|rules)/,
  /disregard (all |any )?(of )?(the |your )?(previous|prior|above|earlier)/,
  /\byou are now\b/,
  /\bsystem prompt\b/,
  /(önceki|yukaridaki) (tüm )?talimatlari (yok say|unut|dikkate alma|görmezden gel)/,
  /risk (skoru|score)[^.\n]{0,30}\b(0|sifir|zero)\b/,
  /(do not|don't|never) (report|flag|mention|list) (any )?(risks?|clauses?)/,
  /hiçbir (risk|riskli madde|madde)[^.\n]{0,20}(bildirme|raporlama|gösterme|listeleme)/,
];

export function detectInjection(text) {
  const t = normalize(text);
  const found = new Set();
  for (const p of PATTERNS) {
    for (const m of t.matchAll(new RegExp(p.source, 'g'))) found.add(m[0]);
  }
  return [...found];
}
