import { PageController } from '@page-agent/page-controller';
import { isLegalPage } from '../core/detect.js';
import { createPanel } from './panel.js';

let panel = null;
const getPanel = () => (panel ??= createPanel(document.body, { onAnalyze: runAnalysis }));

// page-agent'ın DOM okuyucusu: görünür metni çıkarır.
async function extractText() {
  const pc = new PageController({ viewportExpansion: -1 });
  try {
    const state = await pc.getBrowserState();
    return state.content;
  } finally {
    await pc.cleanUpHighlights();
    pc.dispose();
  }
}

async function runAnalysis() {
  const p = getPanel();
  try {
    const { text, rawPageText } = await p.withDetached(async () => ({
      text: await extractText(),
      rawPageText: document.body.textContent ?? '',
    }));
    p.showLoading();
    p.showReport(await chrome.runtime.sendMessage({ type: 'analyze', text, rawPageText }));
  } catch (e) {
    p.showReport({ status: 'failed', error: e.message ?? String(e) });
  }
}

if (isLegalPage(location.href, document.title)) {
  chrome.runtime.sendMessage({ type: 'legal-page-detected' });
  getPanel().showIntro();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'start-analysis') runAnalysis();
});
