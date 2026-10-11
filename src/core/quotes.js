import { normalize } from './text.js';

export const MIN_QUOTE_LENGTH = 20;

export function quoteSpan(quote, normalizedDoc) {
  const q = normalize(quote);
  if (q.length < MIN_QUOTE_LENGTH) return null;
  const start = normalizedDoc.indexOf(q);
  return start === -1 ? null : { start, end: start + q.length };
}

export function verifyQuote(quote, normalizedDoc) {
  return quoteSpan(quote, normalizedDoc) !== null;
}
