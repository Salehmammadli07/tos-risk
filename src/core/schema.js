import { z } from 'zod';

export const CATEGORIES = [
  'auto_renewal', 'data_sharing', 'unilateral_change', 'arbitration_waiver',
  'account_termination', 'liability_limit', 'content_license', 'refund_cancel',
];

const ClauseSchema = z.object({
  category: z.enum(CATEGORIES),
  severity: z.enum(['low', 'medium', 'high']),
  quote: z.string().min(1),
  explanation_tr: z.string().min(1),
  advice_tr: z.string().min(1),
});

export const LlmOutputSchema = z.object({
  is_legal_document: z.boolean(),
  document_type: z.enum(['tos', 'privacy', 'subscription', 'other']),
  summary_tr: z.string(),
  clauses: z.array(ClauseSchema).max(30),
});

// Gemini'ye gönderilen şema aynı zod tanımından üretilir; tek kaynak.
// Gemini `maxItems` görünce HTTP 400 döndürüyor; bu sınırı yalnızca zod uygular.
const { $schema, ...jsonSchema } = z.toJSONSchema(LlmOutputSchema);
export const llmJsonSchema = JSON.parse(JSON.stringify(jsonSchema, (k, v) => (k === 'maxItems' ? undefined : v)));

export function parseLlmOutput(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: `Yanıt geçerli JSON değil: ${e.message}` };
  }
  const result = LlmOutputSchema.safeParse(data);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, error: z.prettifyError(result.error) };
}
