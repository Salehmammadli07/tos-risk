import { normalize } from '../src/core/text.js';
import { quoteSpan } from '../src/core/quotes.js';

const overlaps = (a, b) => Boolean(a && b && a.start < b.end && b.start < a.end);

// Ortak eşleştirici: aynı kategori + `same(konum, konum)`. Her altın madde en fazla
// bir kez yakalanır; zaten yakalanmış bir altına ikinci eşleşme "tekrar" sayılır.
function match(predicted, gold, locate, same) {
  const goldLocs = gold.map((x) => locate(x.quote));
  const used = new Set();
  const caught = [];
  const falseAlarms = [];
  const duplicates = [];
  for (const p of predicted) {
    const loc = locate(p.quote);
    const hits = gold
      .map((x, i) => i)
      .filter((i) => gold[i].category === p.category && same(loc, goldLocs[i]));
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

// Katı ölçüt: alıntıların metindeki konumları örtüşüyor.
export function matchClauses(predicted, gold, normalizedDoc) {
  return match(predicted, gold, (q) => quoteSpan(q, normalizedDoc), overlaps);
}

// Hüküm ölçütü: alıntılar aynı paragrafta (aynı hükmün farklı cümlesi de sayılır).
export function matchByParagraph(predicted, gold, rawDoc) {
  const paragraphs = rawDoc.split(/\n+/).map(normalize);
  const locate = (q) => {
    const n = normalize(q);
    const i = paragraphs.findIndex((p) => p.includes(n));
    return i === -1 ? null : i;
  };
  return match(predicted, gold, locate, (a, b) => a !== null && a === b);
}
