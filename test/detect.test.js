import { describe, it, expect } from 'vitest';
import { isLegalPage } from '../src/core/detect.js';

describe('isLegalPage', () => {
  it.each([
    ['https://www.spotify.com/tr/legal/end-user-agreement/', ''],
    ['https://help.netflix.com/legal/termsofuse', ''],
    ['https://www.trendyol.com/uyelik-sozlesmesi', ''],
    ['https://site.com/Kullan%C4%B1m-Ko%C5%9Fullar%C4%B1', ''],
    ['https://site.com/p/123', 'Gizlilik Politikası'],
    ['https://site.com/abonelik-sartlari', ''],
    ['http://localhost:5173/kullanim-kosullari.html', ''],
  ])('yasal sayfa: %s %s', (url, title) => {
    expect(isLegalPage(url, title)).toBe(true);
  });

  it.each([
    ['https://site.com/photos', 'Fotoğraflar'],
    ['https://example.com/', 'Ana Sayfa'],
    ['https://site.com/%E0%A4%A', 'Bozuk adres'],
  ])('yasal değil: %s %s', (url, title) => {
    expect(isLegalPage(url, title)).toBe(false);
  });
});
