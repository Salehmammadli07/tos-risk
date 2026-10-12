// "tos" tek başına çok gevşek (ör. "tos-risk" proje adı); /tos sayfalarının başlığında zaten "terms" geçer.
const LEGAL = /\b(terms|termsofuse|privacy|legal|eula|agreement|subscription|gizlilik|kosullar\w*|sartlar\w*|sozlesme\w*|abonelik|aydinlatma|kvkk)\b/;

function fold(s) {
  return s
    .toLowerCase()
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// Sorgu ve # kısmına bakılmaz. Arama sonucu sayfaları ("google.com/search?q=spotify+terms")
// başlıkta da aranan kelimeyi taşıdığı için baştan dışlanır.
function parse(url) {
  try {
    const u = new URL(url);
    const isSearch = /\/search\b/.test(u.pathname) || ['q', 'query', 'search'].some((k) => u.searchParams.has(k));
    return { hostAndPath: `${u.hostname}${u.pathname}`, isSearch };
  } catch {
    return { hostAndPath: url, isSearch: false };
  }
}

export function isLegalPage(url, title = '') {
  const { hostAndPath, isSearch } = parse(url);
  if (isSearch) return false;
  const words = fold(`${safeDecode(hostAndPath)} ${title}`).replace(/[^a-z0-9]+/g, ' ');
  return LEGAL.test(words);
}
