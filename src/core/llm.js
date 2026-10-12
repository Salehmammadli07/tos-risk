export const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
// Ücretsiz katmanda Flash modelleri sık 503 veriyor ve günde 20 istekle sınırlı;
// Flash Lite hızlı ve günde 500 istek veriyor. Eval'de GEMINI_MODEL ile değiştirilebilir.
export const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

// 429 (kota), 503 (yoğunluk) ve zaman aşımı geçici; bu sürelerle bekleyip yeniden denenir.
const RETRYABLE = new Set([429, 503]);
const DEFAULT_RETRY_DELAYS_MS = [5000, 15000, 30000];
const DEFAULT_TIMEOUT_MS = 120000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function explain(status) {
  if ([400, 401, 403].includes(status)) return 'API anahtarı geçersiz ya da istek reddedildi; uzantı simgesinden anahtarı kontrol edin';
  if (status === 429) return 'Gemini kotası doldu; biraz sonra tekrar deneyin';
  if (status === 503) return 'Gemini şu an çok yoğun; biraz sonra tekrar deneyin';
  return 'Gemini isteği başarısız oldu';
}

export function createGeminiClient({
  apiKey,
  model = DEFAULT_MODEL,
  fetchImpl = (...a) => fetch(...a),
  retryDelaysMs = DEFAULT_RETRY_DELAYS_MS,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  return async function complete(messages, jsonSchema) {
    const body = JSON.stringify({
      model,
      messages,
      temperature: 0,
      response_format: { type: 'json_schema', json_schema: { name: 'tos_risk_report', schema: jsonSchema } },
    });
    for (let attempt = 0; ; attempt++) {
      const canRetry = attempt < retryDelaysMs.length;
      let res;
      try {
        res = await fetchImpl(GEMINI_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body,
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (e) {
        if (e?.name === 'TypeError') throw new Error('İnternet bağlantısı kurulamadı; bağlantınızı kontrol edip tekrar deneyin.');
        if (e?.name !== 'TimeoutError') throw e;
        if (!canRetry) throw new Error(`Gemini zaman aşımı: ${timeoutMs / 1000} sn içinde yanıt gelmedi.`);
        await sleep(retryDelaysMs[attempt]);
        continue;
      }
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? '';
      }
      if (!RETRYABLE.has(res.status) || !canRetry) {
        throw new Error(`${explain(res.status)} (Gemini HTTP ${res.status}): ${(await res.text()).slice(0, 200)}`);
      }
      await sleep(retryDelaysMs[attempt]);
    }
  };
}
