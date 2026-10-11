import { describe, it, expect } from 'vitest';
import { parseLlmOutput, llmJsonSchema } from '../src/core/schema.js';

const valid = {
  is_legal_document: true,
  document_type: 'tos',
  summary_tr: 'Abonelik sözleşmesi.',
  clauses: [{
    category: 'auto_renewal', severity: 'high',
    quote: 'otomatik olarak yenilenir ve kayıtlı kartınızdan',
    explanation_tr: 'İptal etmezsen ücret alınmaya devam eder.',
    advice_tr: 'Yenileme tarihini takvimine yaz.',
  }],
};

describe('parseLlmOutput', () => {
  it('geçerli çıktıyı kabul eder', () => {
    const r = parseLlmOutput(JSON.stringify(valid));
    expect(r.ok).toBe(true);
    expect(r.data.clauses).toHaveLength(1);
  });
  it('JSON olmayan metni reddeder', () => {
    const r = parseLlmOutput('Tabii! İşte analiz: ...');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/JSON/);
  });
  it('eksik alanı reddeder', () => {
    const { summary_tr, ...rest } = valid;
    expect(parseLlmOutput(JSON.stringify(rest)).ok).toBe(false);
  });
  it('bilinmeyen kategoriyi reddeder', () => {
    const bad = { ...valid, clauses: [{ ...valid.clauses[0], category: 'other' }] };
    expect(parseLlmOutput(JSON.stringify(bad)).ok).toBe(false);
  });
});

describe('llmJsonSchema', () => {
  it('Gemini için $schema alanı içermez ve clauses tanımlıdır', () => {
    expect(llmJsonSchema.$schema).toBeUndefined();
    expect(llmJsonSchema.properties.clauses.type).toBe('array');
  });
  it('Gemini 400 döndürdüğü için maxItems içermez; sınırı zod yine uygular', () => {
    expect(JSON.stringify(llmJsonSchema)).not.toMatch(/maxItems/);
    const many = { ...valid, clauses: Array(31).fill(valid.clauses[0]) };
    expect(parseLlmOutput(JSON.stringify(many)).ok).toBe(false);
  });
});
