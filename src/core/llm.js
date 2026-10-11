export const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
export const DEFAULT_MODEL = 'gemini-3.8-flash';

export function createGeminiClient({ apiKey, model = DEFAULT_MODEL, fetchImpl = (...a) => fetch(...a) }) {
  return async function complete(messages, jsonSchema) {
    const res = await fetchImpl(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0,
        response_format: { type: 'json_schema', json_schema: { name: 'tos_risk_report', schema: jsonSchema } },
      }),
    });
    if (!res.ok) {
      throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const body = await res.json();
    return body.choices?.[0]?.message?.content ?? '';
  };
}
