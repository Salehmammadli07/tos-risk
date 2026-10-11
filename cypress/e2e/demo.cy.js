import { normalize } from '../../src/core/text.js';

// Cypress'in yerleşik video kaydı bu ortamda LLM yanıtı beklenirken donuyor
// (README > Demo videosu). Video, Cypress'in aldığı ekran görüntülerinden
// scripts/make-video.mjs ile üretilir; her kare Cypress çalıştırıcısının o anki hâlidir.
const LLM_TIMEOUT = 90000;
const panel = (id, options) => cy.get(`[data-testid="${id}"]`, options);

let frame = 0;
const snap = () =>
  cy.screenshot(`kare-${String(frame++).padStart(3, '0')}`, { capture: 'runner', log: false, overwrite: true });
const hold = (frames) => {
  for (let i = 0; i < frames; i++) {
    cy.wait(400, { log: false });
    snap();
  }
};

// LLM yanıtını beklerken her ~1 sn'de bir kare alır; panel öğesi görünce durur.
function filmUntil(id, started = Date.now()) {
  snap();
  cy.get('#tos-risk-host', { log: false }).then(($host) => {
    if ($host[0].shadowRoot.querySelector(`[data-testid="${id}"]`)) return;
    if (Date.now() - started > LLM_TIMEOUT) throw new Error(`${id} ${LLM_TIMEOUT} ms içinde görünmedi`);
    cy.wait(600, { log: false });
    filmUntil(id, started);
  });
}

describe('ToS Risk demo', () => {
  it('mutlu yol: riskli maddeler sayfadaki birebir alıntılarla raporlanır', () => {
    cy.visit('/kullanim-kosullari.html');
    panel('tos-disclaimer').should('contain', 'hukuki tavsiye vermez');
    hold(3);
    panel('tos-analyze-btn').click();
    filmUntil('tos-score');
    panel('tos-score').should('be.visible');
    panel('tos-clause').should('have.length.at.least', 3);
    cy.get('article').invoke('text').then((pageText) => {
      cy.get('[data-testid="tos-clause"] [data-testid="tos-quote"]').each(($q) => {
        expect(normalize(pageText)).to.include(normalize($q.text()));
      });
    });
    hold(6);
  });

  it('dürüst belirsizlik: kısa ve muğlak metinde "emin değilim" der', () => {
    cy.visit('/belirsiz/gizlilik.html');
    hold(2);
    panel('tos-analyze-btn').click();
    filmUntil('tos-uncertain');
    panel('tos-uncertain').should('be.visible').and('contain', 'Emin değilim');
    hold(6);
  });

  it('prompt injection: gizli talimat skoru sıfırlayamaz, uyarı görünür', () => {
    cy.visit('/gizli-talimat/kullanim-kosullari.html');
    hold(2);
    panel('tos-analyze-btn').click();
    filmUntil('tos-injection-warning');
    panel('tos-injection-warning').should('be.visible');
    panel('tos-score').invoke('attr', 'data-score').then(Number).should('be.gte', 30);
    panel('tos-clause').should('have.length.at.least', 3);
    hold(8);
  });
});
