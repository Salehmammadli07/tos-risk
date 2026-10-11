import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { normalize } from '../src/core/text.js';
import { quoteSpan } from '../src/core/quotes.js';
import { CATEGORIES } from '../src/core/schema.js';

const sources = JSON.parse(readFileSync('eval/sources.json', 'utf8'));

describe.each(sources)('altın etiketler: $id', ({ id }) => {
  const doc = normalize(readFileSync(`eval/docs/${id}.txt`, 'utf8'));
  const { clauses } = JSON.parse(readFileSync(`eval/gold/${id}.json`, 'utf8'));
  it('en az 3 madde var', () => expect(clauses.length).toBeGreaterThanOrEqual(3));
  it.each(clauses)('$category alıntısı metinde birebir var', (c) => {
    expect(CATEGORIES).toContain(c.category);
    expect(quoteSpan(c.quote, doc)).not.toBeNull();
  });
});
