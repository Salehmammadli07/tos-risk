import { normalize, stripMarkers } from './text.js';
import { verifyQuote } from './quotes.js';
import { parseLlmOutput, llmJsonSchema } from './schema.js';
import { computeScore } from './score.js';
import { detectInjection } from './injection.js';
import { buildMessages } from './prompt.js';

export const MIN_CHARS = 1500;
export const MAX_CHARS = 120000;

async function askWithRetry(complete, messages) {
  const first = parseLlmOutput(await complete(messages, llmJsonSchema));
  if (first.ok) return first;
  const retry = [
    ...messages,
    { role: 'user', content: `Önceki yanıtın şemaya uymadı: ${first.error}\nYalnızca şemaya uygun JSON döndür.` },
  ];
  return parseLlmOutput(await complete(retry, llmJsonSchema));
}

export async function analyzeDocument({ text, complete, rawPageText = '' }) {
  const clean = stripMarkers(text);
  const truncated = clean.length > MAX_CHARS;
  const docText = truncated ? clean.slice(0, MAX_CHARS) : clean;

  let parsed;
  try {
    parsed = await askWithRetry(complete, buildMessages(docText));
  } catch (e) {
    return { status: 'failed', error: e.message };
  }
  if (!parsed.ok) return { status: 'failed', error: `Model geçerli rapor üretemedi. ${parsed.error}` };

  const out = parsed.data;
  const normDoc = normalize(docText);
  const clauses = [];
  const unverified = [];
  for (const c of out.clauses) (verifyQuote(c.quote, normDoc) ? clauses : unverified).push(c);

  const { score, level } = computeScore(clauses);
  const inText = detectInjection(docText);
  const hiddenOnly = detectInjection(rawPageText).filter((m) => !inText.includes(m));

  const reasons = [];
  if (clean.length < MIN_CHARS) reasons.push('Metin çok kısa; sözleşmenin tamamı bu sayfada olmayabilir.');
  if (truncated) reasons.push(`Metin çok uzun; yalnızca ilk ${MAX_CHARS} karakter incelendi.`);
  if (!out.is_legal_document) reasons.push('Bu sayfa bir sözleşme veya politika metnine benzemiyor.');
  if (out.clauses.length > 0 && unverified.length * 2 > out.clauses.length) {
    reasons.push('Modelin iddialarının yarısından fazlası metinde doğrulanamadı.');
  }
  if (inText.length > 0) {
    reasons.push('Metinde yapay zekâya yönelik talimat benzeri ifadeler var; model etkilenmiş olabilir.');
  }

  return {
    status: 'ok',
    isLegalDocument: out.is_legal_document,
    documentType: out.document_type,
    summary: out.summary_tr,
    score,
    level,
    clauses,
    unverified,
    uncertain: reasons.length > 0,
    uncertaintyReasons: reasons,
    injection: { inText, hiddenOnly },
  };
}
