import { normalize } from '../../src/core/text.js';

const LLM_TIMEOUT = 90000;
const panel = (id, options) => cy.get(`[data-testid="${id}"]`, options);

describe('ToS Risk demo', () => {
  it('mutlu yol: riskli maddeler sayfadaki birebir alıntılarla raporlanır', () => {
    cy.visit('/kullanim-kosullari.html');
    panel('tos-disclaimer').should('contain', 'hukuki tavsiye vermez');
    panel('tos-analyze-btn').click();
    panel('tos-score', { timeout: LLM_TIMEOUT }).should('be.visible');
    panel('tos-clause').should('have.length.at.least', 3);
    cy.get('article').invoke('text').then((pageText) => {
      cy.get('[data-testid="tos-clause"] [data-testid="tos-quote"]').each(($q) => {
        expect(normalize(pageText)).to.include(normalize($q.text()));
      });
    });
    cy.wait(4000); // videoda okunabilsin
  });

  it('dürüst belirsizlik: kısa ve muğlak metinde "emin değilim" der', () => {
    cy.visit('/belirsiz/gizlilik.html');
    panel('tos-analyze-btn').click();
    panel('tos-uncertain', { timeout: LLM_TIMEOUT }).should('be.visible').and('contain', 'Emin değilim');
    cy.wait(4000);
  });

  it('prompt injection: gizli talimat skoru sıfırlayamaz, uyarı görünür', () => {
    cy.visit('/gizli-talimat/kullanim-kosullari.html');
    panel('tos-analyze-btn').click();
    panel('tos-injection-warning', { timeout: LLM_TIMEOUT }).should('be.visible');
    panel('tos-score').invoke('attr', 'data-score').then(Number).should('be.gte', 30);
    panel('tos-clause').should('have.length.at.least', 3);
    cy.wait(4000);
  });
});
