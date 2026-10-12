import { describe, it, expect } from 'vitest';
import { normalize, stripMarkers } from '../src/core/text.js';
import { verifyQuote, quoteSpan } from '../src/core/quotes.js';

const DOC = normalize(
  'Madde 4. Aboneliğiniz, dönem sonunda İPTAL etmediğiniz sürece otomatik olarak\n  yenilenir ve kayıtlı kartınızdan “aylık ücret” tahsil edilir. Ilık süt.'
);

describe('verifyQuote', () => {
  it('birebir alıntıyı bulur', () => {
    expect(verifyQuote('otomatik olarak yenilenir ve kayıtlı kartınızdan', DOC)).toBe(true);
  });
  it('büyük-küçük harf ve boşluk farkını tolere eder', () => {
    expect(verifyQuote('DÖNEM SONUNDA iptal   etmediğiniz sürece', DOC)).toBe(true);
  });
  it('akıllı tırnak ve nbsp farkını tolere eder', () => {
    expect(verifyQuote('kartınızdan "aylık ücret" tahsil edilir. ılık süt', DOC)).toBe(true);
  });
  it('20 karakterden kısa alıntıyı reddeder', () => {
    expect(verifyQuote('otomatik', DOC)).toBe(false);
  });
  it('metinde olmayan alıntıyı reddeder', () => {
    expect(verifyQuote('verileriniz üçüncü taraflara satılabilir', DOC)).toBe(false);
  });
  it('üç noktayla kısaltılmış alıntıyı reddeder', () => {
    expect(verifyQuote('Aboneliğiniz, dönem sonunda ... otomatik olarak yenilenir', DOC)).toBe(false);
  });
});

describe('quoteSpan', () => {
  it('normalize metindeki konumu döner', () => {
    const span = quoteSpan('otomatik olarak yenilenir', DOC);
    expect(DOC.slice(span.start, span.end)).toBe('otomatik olarak yenilenir');
  });
  it('bulunamazsa null döner', () => {
    expect(quoteSpan('yok böyle bir cümle burada', DOC)).toBeNull();
  });
});

describe('stripMarkers', () => {
  it('page-controller etkileşim işaretlerini siler', () => {
    expect(stripMarkers('Ayrıntılar için [12]<a href="/p">Gizlilik</a> sayfasına bakın.'))
      .toBe('Ayrıntılar için Gizlilik sayfasına bakın.');
  });
  it('bağlantıdan sonra gelen noktalama ve ek, alıntıyla aynı normalize olur', () => {
    const extracted = normalize(stripMarkers("Ayrıntılar\n*[1]<a >Gizlilik Politikası />\n'nda yer alır. Bkz.\n*[2]<a >Şartlar />\n."));
    expect(verifyQuote("Ayrıntılar Gizlilik Politikası'nda yer alır.", extracted)).toBe(true);
    expect(verifyQuote('yer alır. Bkz. Şartlar.', extracted)).toBe(true);
  });
  it('page-controller 1.12.4 gerçek çıktı biçimini temizler', () => {
    const raw = 'Ayrıntılar için\n*[2]<a >buraya />\nbakın.\n[3]<button type=submit>Kabul />';
    expect(normalize(stripMarkers(raw))).toBe('ayrintilar için buraya bakin. kabul');
  });
});
