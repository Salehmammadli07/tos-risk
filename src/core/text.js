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
    // page-agent bağlantıyı ayrı satıra koyar: "Politikası\n'nda" → "politikasi 'nda".
    .replace(/ ([.,;:!?)'])/g, '$1')
    .trim();
}

// page-controller çıktısındaki etkileşim işaretlerini siler:
// "*[2]<a >buraya />" → "buraya" (1.12.4 biçimi); "</a>" gibi etiketler de gider.
export function stripMarkers(s) {
  return s
    .replace(/\*?\[\d+\]<[^>]*>/g, '')
    .replace(/ ?\/>/g, '')
    .replace(/<\/?[a-z][^>]*>/gi, '');
}
