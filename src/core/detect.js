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

export function isLegalPage(url, title = '') {
  const words = fold(`${safeDecode(url)} ${title}`).replace(/[^a-z0-9]+/g, ' ');
  return LEGAL.test(words);
}
