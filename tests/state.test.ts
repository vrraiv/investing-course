import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, parseBackup } from '../src/lib/state';
test('versioned backup round trip preserves user content', () => {
  const state = initialState();
  state.answers['week-1-0'] = { answer: '<script>literal notes</script>', notes: 'Research', score: 2 };
  state.progress['01-roadmap#week-1'] = 'complete';
  assert.deepEqual(parseBackup(JSON.stringify(state)), state);
});
test('reject unsupported versions, corrupt scores and impossible dates', () => {
  assert.throws(() => parseBackup(JSON.stringify({ ...initialState(), version: 2 })));
  assert.throws(() => parseBackup(JSON.stringify({ ...initialState(), week: 25 })));
  assert.throws(() => parseBackup(JSON.stringify({ ...initialState(), answers: { a: { answer: '', notes: '', score: 3 } } })));
  assert.throws(() => parseBackup(JSON.stringify({ ...initialState(), navHistory: [{ date: '2026-02-30', nav: 100 }] })));
});
test('duplicate record IDs are rejected', () => {
  const row = { id: 'a', date: '2026-01-01', followUp: '', observation: 'Market', thesis: '', implication: '', confidence: 3 };
  assert.throws(() => parseBackup(JSON.stringify({ ...initialState(), journal: [row, row] })));
});
