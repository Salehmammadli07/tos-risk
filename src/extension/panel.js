import { DISCLAIMER, CATEGORY_TR, SEVERITY_TR, LEVEL_TR } from '../core/labels.js';

const CSS = `
.box{font:14px/1.45 system-ui,sans-serif;color:#1d1d1f;background:#fff;border:1px solid #d0d0d7;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.18);max-height:calc(100vh - 32px);overflow:auto}
.disclaimer{margin:0;padding:10px 12px;background:#fff3cd;border-bottom:1px solid #ecd58a;font-weight:600;font-size:13px}
.body{padding:12px}
button{font:inherit;padding:8px 12px;border-radius:6px;border:0;background:#2251d1;color:#fff;cursor:pointer}
.score{font-size:18px;font-weight:700;padding:8px 10px;border-radius:6px;margin-bottom:10px}
.low{background:#e3f4e8}.medium{background:#fff1d6}.high{background:#fde2e1}
.uncertain,.warn{background:#eef1ff;border-left:4px solid #5865f2;padding:8px 10px;margin-bottom:10px}
.warn{background:#fff0f0;border-color:#d93025}
.clause{border-top:1px solid #eee;padding:10px 0}
.cat{font-weight:600}
blockquote{margin:6px 0;padding:6px 10px;background:#f6f6f8;border-left:3px solid #999;font-style:italic}
.advice{color:#2b5d2b}
.error{color:#b3261e}
ul{margin:4px 0;padding-left:18px}
`;

// Yalnızca text node ekler; LLM çıktısı asla HTML olarak yorumlanmaz.
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'onclick') node.addEventListener('click', v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return node;
}

function renderClause(c, testid) {
  return el('div', { class: 'clause', 'data-testid': testid },
    el('div', { class: 'cat' }, `${CATEGORY_TR[c.category]} · ${SEVERITY_TR[c.severity]} şiddet`),
    el('blockquote', { 'data-testid': 'tos-quote' }, c.quote),
    el('p', {}, c.explanation_tr),
    el('p', { class: 'advice' }, `Öneri: ${c.advice_tr}`));
}

function renderReport(r, onAnalyze) {
  if (r.status !== 'ok') {
    return [
      el('p', { class: 'error', 'data-testid': 'tos-error' }, `Analiz yapılamadı: ${r.error}`),
      el('button', { onclick: onAnalyze }, 'Tekrar dene'),
    ];
  }
  const nodes = [
    el('div', { class: `score ${r.level}`, 'data-testid': 'tos-score', 'data-score': String(r.score) },
      `Risk skoru: ${r.score}/100 · ${LEVEL_TR[r.level]}`),
  ];
  if (r.uncertain) {
    nodes.push(el('div', { class: 'uncertain', 'data-testid': 'tos-uncertain' },
      el('strong', {}, 'Emin değilim. Bu sonuca temkinli yaklaşın:'),
      el('ul', {}, r.uncertaintyReasons.map((x) => el('li', {}, x)))));
  }
  const inj = [...r.injection.inText, ...r.injection.hiddenOnly.map((m) => `${m} (gizli metinde; analize alınmadı)`)];
  if (inj.length > 0) {
    nodes.push(el('div', { class: 'warn', 'data-testid': 'tos-injection-warning' },
      el('strong', {}, 'Sayfada yapay zekâya yönelik talimat bulundu.'),
      el('p', {}, 'Bu talimatlar uygulanmadı. Skor, modelin değil kodun hesabıdır ve yalnızca metinde doğrulanmış alıntılara dayanır.'),
      el('ul', {}, inj.map((x) => el('li', {}, x)))));
  }
  nodes.push(el('p', { 'data-testid': 'tos-summary' }, r.summary));
  if (r.clauses.length === 0) nodes.push(el('p', {}, 'Doğrulanmış riskli madde bulunamadı.'));
  nodes.push(...r.clauses.map((c) => renderClause(c, 'tos-clause')));
  if (r.unverified.length > 0) {
    nodes.push(el('details', { 'data-testid': 'tos-unverified' },
      el('summary', {}, `Doğrulanamayan iddialar (${r.unverified.length}): alıntı metinde bulunamadı, skora katılmadı`),
      r.unverified.map((c) => renderClause(c, 'tos-unverified-clause'))));
  }
  return nodes;
}

export function createPanel(parent, { onAnalyze }) {
  const host = document.createElement('div');
  host.id = 'tos-risk-host';
  host.style.cssText = 'all:initial;position:fixed;top:16px;right:16px;z-index:2147483647;width:380px';
  const root = host.attachShadow({ mode: 'open' });
  const body = el('div', { class: 'body' });
  root.append(el('style', {}, CSS),
    el('div', { class: 'box', 'data-testid': 'tos-panel' },
      el('p', { class: 'disclaimer', 'data-testid': 'tos-disclaimer' }, DISCLAIMER), body));
  parent.append(host);

  const set = (...nodes) => body.replaceChildren(...nodes.flat());
  return {
    host,
    root,
    showIntro() {
      set(el('p', {}, 'Bu sayfa bir kullanım koşulu / gizlilik / abonelik metnine benziyor.'),
        el('button', { 'data-testid': 'tos-analyze-btn', onclick: onAnalyze }, 'Riskleri analiz et'));
    },
    showLoading() {
      set(el('p', { 'data-testid': 'tos-loading' }, 'Metin okunuyor ve analiz ediliyor…'));
    },
    showReport(report) {
      set(renderReport(report, onAnalyze));
    },
    // Metin çıkarılırken panelin kendi yazıları (ve eski alıntılar) analize karışmasın.
    async withDetached(fn) {
      host.remove();
      try {
        return await fn();
      } finally {
        parent.append(host);
      }
    },
  };
}
