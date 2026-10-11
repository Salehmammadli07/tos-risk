import { describe, it, expect } from 'vitest';
import { normalize } from '../src/core/text.js';
import { matchClauses } from './match.js';

const DOC = normalize('Abonelik her ay otomatik olarak yenilenir ve ücret alınır. Verileriniz reklam ortaklarımızla paylaşılabilir ve satılabilir. İade yapılmaz, hiçbir koşulda ücret iadesi söz konusu değildir.');
const g = (category, quote) => ({ category, quote });

describe('matchClauses', () => {
  const gold = [
    g('auto_renewal', 'Abonelik her ay otomatik olarak yenilenir ve ücret alınır.'),
    g('data_sharing', 'Verileriniz reklam ortaklarımızla paylaşılabilir ve satılabilir.'),
    g('refund_cancel', 'hiçbir koşulda ücret iadesi söz konusu değildir'),
  ];
  it('aynı kategori + örtüşen alıntı = yakalandı; kalanlar kaçırıldı', () => {
    const r = matchClauses([g('auto_renewal', 'otomatik olarak yenilenir ve ücret alınır')], gold, DOC);
    expect(r.caught).toHaveLength(1);
    expect(r.missed.map((m) => m.category)).toEqual(['data_sharing', 'refund_cancel']);
    expect(r.falseAlarms).toEqual([]);
  });
  it('kategori farklıysa yanlış alarm + kaçırma', () => {
    const r = matchClauses([g('liability_limit', 'otomatik olarak yenilenir ve ücret alınır')], gold, DOC);
    expect(r.caught).toHaveLength(0);
    expect(r.falseAlarms).toHaveLength(1);
  });
  it('zaten yakalanmış altına ikinci eşleşme tekrar sayılır, yanlış alarm değil', () => {
    const r = matchClauses([
      g('data_sharing', 'Verileriniz reklam ortaklarımızla paylaşılabilir'),
      g('data_sharing', 'paylaşılabilir ve satılabilir'),
    ], gold, DOC);
    expect(r.caught).toHaveLength(1);
    expect(r.duplicates).toHaveLength(1);
    expect(r.falseAlarms).toEqual([]);
  });
});
