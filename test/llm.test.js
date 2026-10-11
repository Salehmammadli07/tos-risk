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
    const complete = createGeminiClient({ apiKey: 'K', fetchImpl: fakeFetch(400, { error: 'bad' }) });
    await expect(complete([], {})).rejects.toThrow(/400/);
  });
  it('429/503 (yoğunluk, kota) gelirse bekleyip yeniden dener', async () => {
    const statuses = [503, 429, 200];
    const calls = [];
    const fetchImpl = async () => {
      const status = statuses.shift();
      calls.push(status);
      return {
        ok: status === 200, status,
        json: async () => ({ choices: [{ message: { content: 'tamam' } }] }),
        text: async () => 'yoğun',
      };
    };
    const complete = createGeminiClient({ apiKey: 'K', fetchImpl, retryDelaysMs: [0, 0] });
    expect(await complete([], {})).toBe('tamam');
    expect(calls).toEqual([503, 429, 200]);
  });
  it('yeniden denemeler tükenince son hatayı fırlatır', async () => {
    const complete = createGeminiClient({ apiKey: 'K', fetchImpl: fakeFetch(503, {}), retryDelaysMs: [0, 0] });
    await expect(complete([], {})).rejects.toThrow(/503/);
  });
});
