import { z } from 'zod';

export const STORAGE_KEY = 'macro-practice-v1';
const finite = z.number();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s);
const timestamp = z.iso.datetime();
const textRecord = z.record(z.string(), z.string());
export const journalSchema = z.object({ id: z.string().min(1), date, followUp: z.union([date, z.literal('')]), observation: z.string().min(1), thesis: z.string(), implication: z.string(), confidence: z.number().int().min(1).max(5) });
const memoSchema = z.object({ id: z.string().min(1), title: z.string().min(1), date, reviewDate: z.union([date, z.literal('')]), createdAt: timestamp, updatedAt: timestamp, status: z.enum(['open', 'closed']), closedAt: timestamp.optional(), fields: textRecord, postMortem: z.string() });
const positionSchema = z.object({
  trade_id: z.string().min(1), opened_at: timestamp, closed_at: timestamp.optional(), status: z.enum(['open', 'closed']),
  memo_id: z.string(), memo_snapshot: memoSchema, theme: z.string().min(1), country: z.string().min(1), asset_class: z.string().min(1), instrument: z.string().min(1), direction: z.enum(['long', 'short']),
  notional: finite.positive(), entry_price: finite.positive(), current_price: finite.nonnegative(), dv01: finite, vol_target: finite.nonnegative(),
  thesis: z.string(), market_pricing: z.string(), catalyst: z.string(), invalidation: z.string(), target: z.string(), review_date: date,
  carry_estimate: finite, bull_pnl: finite, base_pnl: finite, bear_pnl: finite, realized_pnl: finite, unrealized_pnl: finite, notes: z.string(),
});
export const stateSchema = z.object({
  version: z.literal(1), theme: z.enum(['light', 'dark']), week: z.number().int().min(1).max(24),
  progress: z.record(z.string(), z.enum(['not-started', 'in-progress', 'complete'])),
  answers: z.record(z.string(), z.object({ answer: z.string(), notes: z.string(), score: z.number().int().min(0).max(2).nullable() })),
  cases: z.record(z.string(), z.object({ view: z.string(), committedAt: timestamp })),
  journal: z.array(journalSchema), memos: z.array(memoSchema), positions: z.array(positionSchema),
  navHistory: z.array(z.object({ date, nav: finite })),
  drills: z.array(z.object({ id: z.string(), question: z.string(), answer: z.string(), score: z.number().int().min(0).max(2), date: timestamp, duration: finite.nonnegative() })),
}).superRefine((value, ctx) => {
  for (const [name, ids] of [
    ['journal', value.journal.map(v => v.id)], ['memos', value.memos.map(v => v.id)],
    ['positions', value.positions.map(v => v.trade_id)], ['drills', value.drills.map(v => v.id)], ['navHistory', value.navHistory.map(v => v.date)],
  ] as const) {
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: `Duplicate IDs in ${name}` });
  }
  value.positions.forEach(p => {
    if (p.memo_snapshot.id !== p.memo_id || (p.status === 'closed' && !p.closed_at)) ctx.addIssue({ code: 'custom', message: 'Invalid position audit record' });
  });
});
export type State = z.infer<typeof stateSchema>;
export type Journal = z.infer<typeof journalSchema>;
export type Memo = z.infer<typeof memoSchema>;
export type Position = z.infer<typeof positionSchema>;
export const initialState = (): State => ({ version: 1, theme: 'light', week: 1, progress: {}, answers: {}, cases: {}, journal: [], memos: [], positions: [], navHistory: [], drills: [] });
export function parseBackup(raw: string): State { return stateSchema.parse(JSON.parse(raw)); }
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
