export const WEIGHTS = {
  data_sharing: 25,
  auto_renewal: 20,
  arbitration_waiver: 20,
  unilateral_change: 15,
  content_license: 15,
  refund_cancel: 15,
  account_termination: 10,
  liability_limit: 10,
};

export const SEVERITY_MULTIPLIER = { low: 0.5, medium: 1, high: 1.5 };

export function levelFor(score) {
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

// Skor yalnızca doğrulanmış maddelerden hesaplanır; LLM skor üretmez.
export function computeScore(clauses) {
  const best = {};
  for (const { category, severity } of clauses) {
    best[category] = Math.max(best[category] ?? 0, SEVERITY_MULTIPLIER[severity]);
  }
  const total = Object.entries(best).reduce((sum, [cat, m]) => sum + WEIGHTS[cat] * m, 0);
  const score = Math.min(100, Math.round(total));
  return { score, level: levelFor(score) };
}
