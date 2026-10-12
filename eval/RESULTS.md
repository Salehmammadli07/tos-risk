# Mini eval — 5 gerçek ToS metni

Hedef: Sistemin riskli maddelerden hangilerini **yakaladığını**, hangilerini **kaçırdığını** ve nerede **yanlış alarm** verdiğini ölçmek.

## Belgeler

Metinler 11 Ekim 2026'da alındı ve `eval/docs/` klasörüne kaydedildi.

| Belge | Tür | Dil | Karakter | Altın madde |
|---|---|---|---|---|
| Spotify Kullanım Şartları | ToS + abonelik | TR | 45.869 | 18 |
| YouTube Hizmet Şartları | ToS | TR | 25.918 | 8 |
| Amazon.com.tr Kullanım ve Satış Koşulları | ToS + satış | TR | 46.129 | 12 |
| Disney Gizlilik Politikası | Gizlilik | TR | 28.917 | 12 |
| Duolingo Terms and Conditions | ToS + abonelik | EN | 32.965 | 18 |

Netflix, Trendyol ve Getir istenmişti ama sayfaları otomatik erişimi engelledi (404/403).

## Altın etiketler (doğru cevap listesi)

- Spec'teki 8 kategoriden birine giren ve tüketici aleyhine olan **her ayrı hüküm** bir maddedir. Aynı hükmün tekrarları tek madde sayılır.
- Her maddenin alıntısı metinde birebir bulunur; bunu `eval/gold.test.js` kodla doğrular.
- ⚠️ **Sınırlama:** Etiketleri Claude metni okuyarak hazırladı ve ikinci kez gözden geçirdi. Bağımsız bir insan kontrolünden geçmedi. İkinci geçişte çıkarılan tek madde: Amazon'daki "diğer ödeme yöntemlerini kullanabiliriz" (kategoriye zorla sokuluyordu). Etiketler, model çıktıları görüldükten sonra **değiştirilmedi**.

## Ölçüm

Her çalıştırma iki ölçütle puanlanır (`eval/score.js`, kayıtlı çıktılardan, API çağrısı yapmadan):

- **Katı:** Aynı kategori ve alıntının metindeki konumu altın alıntıyla örtüşüyor.
- **Hüküm:** Aynı kategori ve alıntı aynı paragrafta. Model aynı hükmün başka bir cümlesini alıntıladığında katı ölçüt bunu hem yanlış alarm hem kaçırma sayıyordu; hüküm ölçütü bunu düzeltir.

**Doğrulanamayan** iddialar (alıntısı metinde yok) rapora girmez, bu yüzden yanlış alarm sayılmaz; ayrı sütunda verilir. Her çalıştırma tek seferlik ve `temperature: 0` ile yapıldı.

## Sonuçlar

| Çalıştırma | Model | Prompt | Katı P / R | Hüküm P / R | Doğrulanamayan |
|---|---|---|---|---|---|
| [v1](results/v1-prompt1-flash-lite.md) | gemini-3.5-flash-lite | 1 | 81% / 25% | 86% / 26% | 3 / 24 (13%) |
| [v2](results/v2-prompt2-flash-lite.md) | gemini-3.5-flash-lite | 2 | 62% / 26% | 76% / 32% | 11 / 40 (28%) |
| [v3](results/v3-prompt2-flash-3.6.md) | gemini-3.6-flash | 2 | 81% / 37% | **90% / 41%** | **0 / 31 (0%)** |

**Prompt 2'nin farkı:** Aynı kategorideki ayrı hükümler ayrı ayrı istenir ve alıntının tek bir cümleden seçilmesi istenir.

v3, hüküm ölçütüne göre 68 altın maddenin 28'ini yakaladı, 40'ını kaçırdı ve 3 yanlış alarm verdi.

Ham model çıktıları: `eval/runs/<çalıştırma>/`. Belge bazında kaçırılan ve yanlış alarm listeleri: `eval/results/`.

## Gözlemler

1. **Doğrulayıcı çalışıyor.** v1'de model 3 alıntıyı kısalttı ("..." ekledi, parantez içini atladı); v2'de bu sayı 11 oldu. Hiçbiri rapora ve skora girmedi. v3'te her alıntı birebir çıktı.
2. **Kaçırma, yanlış alarmdan çok daha büyük sorun.** Precision yüksek (%76–90), recall düşük (%26–41).
   - Model belge başına 4–9 madde bildiriyor (v3); altın listede ise 8–18 madde var.
   - En çok kaçırılan kategoriler (v3): veri paylaşımı 11, sorumluluk sınırı 8, tek taraflı değişiklik 7.
   - Disney gizlilik politikasında 10 veri paylaşımı hükmünden yalnız 1 tanesi yakalandı.
3. **Daha çok madde istemek küçük modelde kaliteyi düşürdü.** Flash Lite'ta prompt 2 recall'u 26%'dan 32%'ye çıkardı, ama doğrulanamayan iddia 3'ten 11'e, katı yanlış alarm 4'ten 11'e çıktı. Aynı prompt 3.6 Flash'ta hem recall'u hem precision'ı artırdı. **Prompt ile modelin etkisi bu tasarımda birbirinden ayrılamıyor:** v1 → v3 arasında ikisi birden değişti.
4. **Yanlış alarmların bir kısmı tartışmalı.**
   - Kesin yanlış alarm: v2'de Disney'in "diğer sitelerin gizlilik politikalarını okumanızı öneririz" cümlesi.
   - Altın etikete bilerek girmeyenler:
     - YouTube'un yalnız işletme kullanıcılarına uygulanan 500 € sorumluluk tavanı;
     - Spotify'ın içerik kaldırma hakkı;
     - Spotify'ın kullanıcı adını geri alma hakkı.

     Bunlar savunulabilir bulgular; etiketleme kuralının sınırında kalıyorlar.
5. **Belirsizlik bayrağı eval belgelerinde hiç tetiklenmedi.** Bu belgeler uzun, gerçek sözleşmeler ve hiçbirinde talimat kalıbı yok; doğru davranış bu. Bayrağın tetiklendiği durumlar test sayfalarında gösteriliyor: kısa metin ve gizli talimat (demo videosu).

## Geçerlilik tehditleri

- **Prompt eval belgelerine bakılarak değiştirildi.** Değişiklik genel bir kural; belgeye özgü bir ifade içermiyor. Yine de aynı belgelerde ölçüldüğü için v2/v3 sonuçları iyimser olabilir. Ayrı bir test kümesi yok.
- **Tek çalıştırma.** `temperature: 0` olsa da Gemini yanıtları çalıştırmadan çalıştırmaya biraz değişebilir; varyans ölçülmedi.
- **Model seçimi.** Uzantının varsayılan modeli `gemini-3.5-flash-lite`. Ücretsiz katmanda Flash modelleri günde 20 istekle sınırlı ve sık 503 veriyor. Yani en iyi sonuç (v3), uzantının varsayılan ayarı değil. Model `src/core/llm.js` içindeki `DEFAULT_MODEL` ile değiştirilebilir.
- **Etiketleri tek kişi hazırladı** (yukarıdaki sınırlamaya bakın).

## Yeniden üretmek

```bash
GEMINI_API_KEY=... GEMINI_MODEL=gemini-3.6-flash EVAL_LABEL=v3-prompt2-flash-3.6 npm run eval
node eval/score.js v3-prompt2-flash-3.6 gemini-3.6-flash   # yalnız yeniden puanlama
```
