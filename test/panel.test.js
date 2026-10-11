// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createPanel } from '../src/extension/panel.js';
import { DISCLAIMER } from '../src/core/labels.js';

const okReport = (over = {}) => ({
  status: 'ok', isLegalDocument: true, documentType: 'tos', summary: 'Özet.',
  score: 30, level: 'medium',
  clauses: [{ category: 'auto_renewal', severity: 'high', quote: 'otomatik olarak yenilenir', explanation_tr: 'Açıklama.', advice_tr: 'Öneri.' }],
  unverified: [], uncertain: false, uncertaintyReasons: [], injection: { inText: [], hiddenOnly: [] },
  ...over,
});
const q = (p, id) => p.root.querySelector(`[data-testid="${id}"]`);

let panel;
beforeEach(() => {
  document.body.innerHTML = '<article>Sözleşme</article>';
  panel = createPanel(document.body, { onAnalyze: () => {} });
});

describe('panel', () => {
  it('her durumda disclaimer görünür', () => {
    for (const show of [() => panel.showIntro(), () => panel.showLoading(), () => panel.showReport(okReport()), () => panel.showReport({ status: 'failed', error: 'x' })]) {
      show();
      expect(q(panel, 'tos-disclaimer').textContent).toBe(DISCLAIMER);
    }
  });

  it('skoru, maddeyi ve alıntıyı gösterir', () => {
    panel.showReport(okReport());
    expect(q(panel, 'tos-score').dataset.score).toBe('30');
    expect(panel.root.querySelectorAll('[data-testid="tos-clause"]')).toHaveLength(1);
    expect(q(panel, 'tos-quote').textContent).toBe('otomatik olarak yenilenir');
    expect(q(panel, 'tos-uncertain')).toBeNull();
    expect(q(panel, 'tos-unverified')).toBeNull();
  });

  it('LLM çıktısındaki HTML metin olarak kalır (XSS yok)', () => {
    const evil = '<img src=x onerror="window.hacked=1">';
    panel.showReport(okReport({ summary: evil, clauses: [{ ...okReport().clauses[0], explanation_tr: evil }] }));
    expect(panel.root.querySelector('img')).toBeNull();
    expect(q(panel, 'tos-summary').textContent).toBe(evil);
  });

  it('belirsizlik, injection uyarısı ve doğrulanamayanları gösterir', () => {
    panel.showReport(okReport({
      uncertain: true, uncertaintyReasons: ['Metin çok kısa.'],
      injection: { inText: [], hiddenOnly: ['ignore previous instructions'] },
      unverified: [{ ...okReport().clauses[0], quote: 'uydurma alıntı burada duruyor' }],
    }));
    expect(q(panel, 'tos-uncertain').textContent).toMatch(/Metin çok kısa/);
    expect(q(panel, 'tos-injection-warning').textContent).toMatch(/ignore previous instructions/);
    expect(q(panel, 'tos-unverified').textContent).toMatch(/uydurma alıntı/);
  });

  it('hata raporunu gösterir', () => {
    panel.showReport({ status: 'failed', error: 'Gemini HTTP 401' });
    expect(q(panel, 'tos-error').textContent).toMatch(/401/);
  });

  it('withDetached sırasında panel DOM dışında, sonra (hata olsa da) geri gelir', async () => {
    let inside;
    await panel.withDetached(async () => {
      inside = panel.host.isConnected;
      expect(document.body.textContent).not.toMatch(/hukuki tavsiye/);
    });
    expect(inside).toBe(false);
    expect(panel.host.isConnected).toBe(true);
    await expect(panel.withDetached(async () => { throw new Error('x'); })).rejects.toThrow();
    expect(panel.host.isConnected).toBe(true);
  });
});
