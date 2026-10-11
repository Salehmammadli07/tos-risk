import { describe, it, expect } from 'vitest';
import { createGeminiClient, GEMINI_URL, DEFAULT_MODEL } from '../src/core/llm.js';

function fakeFetch(status, body) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
      text: async () => JSON.stringify(body),
    };
  };
  fn.calls = calls;
  return fn;
}

describe('createGeminiClient', () => {
  it('JSON şemalı isteği doğru gönderir ve içeriği döner', async () => {
    const f = fakeFetch(200, { choices: [{ message: { content: '{"a":1}' } }] });
    const complete = createGeminiClient({ apiKey: 'K', fetchImpl: f });
    const out = await complete([{ role: 'user', content: 'x' }], { type: 'object' });
    expect(out).toBe('{"a":1}');
    const { url, init } = f.calls[0];
    expect(url).toBe(GEMINI_URL);
    expect(init.headers.Authorization).toBe('Bearer K');
    const body = JSON.parse(init.body);
    expect(body.model).toBe(DEFAULT_MODEL);
    expect(body.temperature).toBe(0);
    expect(body.response_format.type).toBe('json_schema');
    expect(body.response_format.json_schema.schema).toEqual({ type: 'object' });
  });
  it('HTTP hatasında durum koduyla hata fırlatır', async () => {
    const complete = createGeminiClient({ apiKey: 'K', fetchImpl: fakeFetch(429, { error: 'quota' }) });
    await expect(complete([], {})).rejects.toThrow(/429/);
  });
});
