// Sayfa metni ve alıntılar aynı kurallarla normalize edilir; karşılaştırma bu
// iki normalize metin arasında yapılır.
export function normalize(s) {
  return s
    .normalize('NFKC')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .toLowerCase()
    .replace(/̇/g, '') // "İ".toLowerCase() → "i̇"
    .replace(/ı/g, 'i') // "I" → "i" ile tutarlı olsun
    .replace(/\s+/g, ' ')
    .trim();
}

// page-controller çıktısındaki "[12]<a ...>" ve "</a>" işaretlerini siler.
export function stripMarkers(s) {
  return s.replace(/\[\d+\]<[^>]*>/g, '').replace(/<\/?[a-z][^>]*>/gi, '');
}
