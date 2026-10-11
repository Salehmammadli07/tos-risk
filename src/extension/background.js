import { analyzeDocument } from '../core/analyze.js';
import { createGeminiClient } from '../core/llm.js';

// Yalnızca `npm run build:test` derlemesinde dolu; normal derlemede boş string.
const TEST_API_KEY = __TEST_API_KEY__;

async function runAnalysis({ text, rawPageText }) {
  const { apiKey } = await chrome.storage.local.get('apiKey');
  const key = apiKey || TEST_API_KEY;
  if (!key) {
    return { status: 'failed', error: 'Gemini API anahtarı yok. Uzantı simgesine tıklayıp anahtarı kaydedin.' };
  }
  return analyzeDocument({ text, rawPageText, complete: createGeminiClient({ apiKey: key }) });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'legal-page-detected' && sender.tab) {
    chrome.action.setBadgeText({ tabId: sender.tab.id, text: '!' });
    chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: '#d93025' });
    return false;
  }
  if (msg.type === 'analyze') {
    runAnalysis(msg).then(sendResponse);
    return true; // yanıt asenkron
  }
  return false;
});
