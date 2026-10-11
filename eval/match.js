import { quoteSpan } from '../src/core/quotes.js';

const overlaps = (a, b) => a && b && a.start < b.end && b.start < a.end;

// Eşleşme: aynı kategori ve alıntıların metindeki konumları örtüşüyor.
export function matchClauses(predicted, gold, normalizedDoc) {
  const goldSpans = gold.map((x) => quoteSpan(x.quote, normalizedDoc));
  const used = new Set();
  const caught = [];
  const falseAlarms = [];
  const duplicates = [];
  for (const p of predicted) {
    const ps = quoteSpan(p.quote, normalizedDoc);
    const hits = gold
      .map((x, i) => i)
      .filter((i) => gold[i].category === p.category && overlaps(ps, goldSpans[i]));
    const free = hits.find((i) => !used.has(i));
    if (free !== undefined) {
      used.add(free);
      caught.push({ predicted: p, gold: gold[free] });
    } else if (hits.length > 0) {
      duplicates.push(p);
    } else {
      falseAlarms.push(p);
    }
  }
  const missed = gold.filter((_, i) => !used.has(i));
  return { caught, missed, falseAlarms, duplicates };
}
