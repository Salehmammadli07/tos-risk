export const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
export const DEFAULT_MODEL = 'gemini-3.8-flash';

// 429 (kota) ve 503 (yoğunluk) geçici; bu sürelerle bekleyip yeniden denenir.
const RETRYABLE = new Set([429, 503]);
const DEFAULT_RETRY_DELAYS_MS = [5000, 15000, 30000];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createGeminiClient({
  apiKey,
  model = DEFAULT_MODEL,
  fetchImpl = (...a) => fetch(...a),
  retryDelaysMs = DEFAULT_RETRY_DELAYS_MS,
}) {
  return async function complete(messages, jsonSchema) {
    const body = JSON.stringify({
      model,
      messages,
      temperature: 0,
      response_format: { type: 'json_schema', json_schema: { name: 'tos_risk_report', schema: jsonSchema } },
    });
    for (let attempt = 0; ; attempt++) {
      const res = await fetchImpl(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body,
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? '';
      }
      if (!RETRYABLE.has(res.status) || attempt >= retryDelaysMs.length) {
        throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      }
      await sleep(retryDelaysMs[attempt]);
    }
  };
}
