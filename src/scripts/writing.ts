import { z } from 'zod';
import { journalSchema, today, type Journal, type Memo } from '../lib/state';
import type { Curriculum } from '../lib/curriculum';
import { state, update, toast, escape, empty, download, fill, field, formValues, readJson, setText } from './store';
import { pnl } from '../lib/finance';

export function initWriting(curriculum: Curriculum, icons: () => void) {
  const journalForm = document.querySelector<HTMLFormElement>('#journal-form');
  if (journalForm) {
    let dirty = false;
    const blank = () => { journalForm.reset(); field(journalForm, 'id').value = ''; field(journalForm, 'date').value = today(); setText('journal-form-title', 'New entry'); setText('confidence-value', '3 / 5'); dirty = false; };
    const render = () => {
      setText('journal-total', `${state.journal.length} ENTRIES`);
      document.querySelector('#journal-list')!.innerHTML = [...state.journal].sort((a, b) => b.date.localeCompare(a.date)).map(j => `<article class="entry-row"><small>${escape(j.date)} / CONFIDENCE ${j.confidence}/5</small><h3>${escape(j.observation)}</h3>${j.thesis ? `<p>${escape(j.thesis)}</p>` : ''}${j.implication ? `<p><strong>Portfolio:</strong> ${escape(j.implication)}</p>` : ''}${j.followUp ? `<small>FOLLOW-UP ${escape(j.followUp)}</small>` : ''}<div class="entry-actions"><button class="icon-button" data-edit-journal="${escape(j.id)}" title="Edit entry" aria-label="Edit entry"><i data-lucide="pencil"></i></button><button class="icon-button" data-delete-journal="${escape(j.id)}" title="Delete entry" aria-label="Delete entry"><i data-lucide="trash-2"></i></button></div></article>`).join('') || empty('No journal entries yet', 'Record your first market observation.'); icons();
    };
    blank(); render();
    journalForm.addEventListener('input', () => { dirty = true; setText('confidence-value', `${field(journalForm, 'confidence').value} / 5`); });
    window.addEventListener('beforeunload', e => { if (dirty) e.preventDefault(); });
    document.querySelector('#journal-new')!.addEventListener('click', () => { if (!dirty || confirm('Discard the unsaved entry?')) blank(); });
    journalForm.addEventListener('submit', e => {
      e.preventDefault(); const values = formValues(journalForm);
      const j: Journal = { id: values.id || crypto.randomUUID(), date: values.date, followUp: values.followUp, observation: values.observation.trim(), thesis: values.thesis, implication: values.implication, confidence: Number(values.confidence) };
      if (!j.observation) { toast('Enter a market observation.', true); return; }
      if (update(s => { const i = s.journal.findIndex(x => x.id === j.id); if (i >= 0) s.journal[i] = j; else s.journal.push(j); })) { blank(); render(); toast('Journal entry saved.'); }
    });
    document.querySelector('#journal-list')!.addEventListener('click', e => {
      const button = (e.target as Element).closest<HTMLButtonElement>('button'); if (!button) return;
      if (button.dataset.editJournal) {
        if (dirty && !confirm('Discard the unsaved entry?')) return;
        const j = state.journal.find(j => j.id === button.dataset.editJournal)!; fill(journalForm, j); setText('journal-form-title', 'Edit entry'); setText('confidence-value', `${j.confidence} / 5`); dirty = false; journalForm.scrollIntoView({ block: 'start' });
      } else if (button.dataset.deleteJournal && confirm('Delete this journal entry?')) {
        if (update(s => { s.journal = s.journal.filter(j => j.id !== button.dataset.deleteJournal); })) { if (field(journalForm, 'id').value === button.dataset.deleteJournal) blank(); render(); toast('Entry deleted.'); }
      }
    });
    document.querySelector('#export-journal')!.addEventListener('click', () => download(`investment-journal-${today()}.json`, JSON.stringify({ version: 1, kind: 'journal', entries: state.journal }, null, 2)));
    document.querySelector('#import-journal')!.addEventListener('change', async e => {
      const input = e.target as HTMLInputElement;
      try {
        const parsed = z.object({ version: z.literal(1), kind: z.literal('journal'), entries: z.array(journalSchema) }).parse(JSON.parse(await readJson(input.files?.[0])));
        if (new Set(parsed.entries.map(j => j.id)).size !== parsed.entries.length) throw new Error('Duplicate entries');
        if (!confirm(`Import ${parsed.entries.length} journal entries? Matching IDs will be replaced.`)) return;
        if (update(s => { const merged = new Map(s.journal.map(j => [j.id, j])); parsed.entries.forEach(j => merged.set(j.id, j)); s.journal = [...merged.values()]; })) { render(); toast('Journal imported.'); }
      } catch { toast('Invalid journal backup. No data was changed.', true); } finally { input.value = ''; }
    });
  }
  const memoForm = document.querySelector<HTMLFormElement>('#memo-form');
  if (memoForm) {
    let dirty = false;
    const selected = () => state.memos.find(m => m.id === field(memoForm, 'id').value);
    const renderPrint = (memo?: Memo) => {
      document.querySelector('#memo-print-view')!.innerHTML = memo ? `<h1>${escape(memo.title)}</h1><p>${escape(memo.date)} / ${escape(memo.status.toUpperCase())}</p><small>Created ${escape(memo.createdAt)} / Updated ${escape(memo.updatedAt)}${memo.closedAt ? ` / Closed ${escape(memo.closedAt)}` : ''}</small>${curriculum.memoFields.map(f => `<h2>${escape(f.name)}</h2><p style="white-space:pre-wrap">${escape(memo.fields[f.name] ?? '')}</p>`).join('')}<h2>Post-mortem</h2><p style="white-space:pre-wrap">${escape(memo.postMortem)}</p>` : '';
    };
    const render = () => {
      const m = selected(); setText('memo-status', m?.status.toUpperCase() ?? 'DRAFT');
      document.querySelector('#memo-list')!.innerHTML = [...state.memos].reverse().map(memo => `<div class="entry-row ${m?.id === memo.id ? 'selected' : ''}"><small>${escape(memo.date)} / ${memo.status.toUpperCase()}</small><h3><a href="#memo-form" data-memo="${escape(memo.id)}">${escape(memo.title)}</a></h3></div>`).join('') || empty('Your casebook is empty', 'Start with one trade thesis.');
      for (const id of ['memo-duplicate', 'memo-export', 'memo-print']) (document.getElementById(id) as HTMLButtonElement).disabled = !m;
      (document.querySelector('#memo-close') as HTMLButtonElement).disabled = !m || m.status === 'closed'; renderPrint(m);
    };
    const blank = () => { memoForm.reset(); field(memoForm, 'id').value = ''; field(memoForm, 'date').value = today(); setText('memo-form-title', 'New trade memo'); dirty = false; render(); };
    const load = (m: Memo) => { fill(memoForm, m); curriculum.memoFields.forEach((f, i) => { field(memoForm, `field-${i}`).value = m.fields[f.name] ?? ''; }); dirty = false; setText('memo-form-title', 'Edit trade memo'); render(); };
    blank(); memoForm.addEventListener('input', () => { dirty = true; });
    window.addEventListener('beforeunload', e => { if (dirty) e.preventDefault(); });
    document.querySelector('#memo-new')!.addEventListener('click', () => { if (!dirty || confirm('Discard unsaved memo changes?')) blank(); });
    document.querySelector('#memo-list')!.addEventListener('click', e => { const a = (e.target as Element).closest<HTMLElement>('[data-memo]'); if (!a) return; e.preventDefault(); if (!dirty || confirm('Discard unsaved memo changes?')) load(state.memos.find(m => m.id === a.dataset.memo)!); });
    memoForm.addEventListener('submit', e => {
      e.preventDefault(); const v = formValues(memoForm); const old = selected(); const now = new Date().toISOString();
      if (!v.title.trim()) { toast('Enter a trade title.', true); return; }
      const m: Memo = { id: old?.id ?? crypto.randomUUID(), title: v.title.trim(), date: v.date, reviewDate: v.reviewDate, createdAt: old?.createdAt ?? now, updatedAt: now, status: old?.status ?? 'open', ...(old?.closedAt ? { closedAt: old.closedAt } : {}), fields: Object.fromEntries(curriculum.memoFields.map((f, i) => [f.name, v[`field-${i}`]])), postMortem: v.postMortem };
      if (update(s => { const i = s.memos.findIndex(x => x.id === m.id); if (i >= 0) s.memos[i] = m; else s.memos.push(m); })) { load(m); toast('Trade memo saved.'); }
    });
    const requireSaved = () => { if (dirty) { toast('Save your changes first.'); return undefined; } return selected(); };
    document.querySelector('#memo-duplicate')!.addEventListener('click', () => {
      const m = requireSaved(); if (!m) return;
      const copy: Memo = { ...structuredClone(m), id: crypto.randomUUID(), title: `${m.title} (copy)`, date: today(), status: 'open', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; delete copy.closedAt;
      if (update(s => { s.memos.push(copy); })) { load(copy); toast('Memo duplicated.'); }
    });
    document.querySelector('#memo-close')!.addEventListener('click', () => {
      const m = requireSaved(); if (!m || !confirm('Close this memo and any open ledger positions linked to it at their current marks?')) return;
      if (update(s => {
        const now = new Date().toISOString(); const memo = s.memos.find(x => x.id === m.id)!; memo.status = 'closed'; memo.closedAt = now; memo.updatedAt = now;
        s.positions.filter(p => p.memo_id === m.id && p.status === 'open').forEach(p => { p.status = 'closed'; p.closed_at = now; p.realized_pnl = pnl(p); p.unrealized_pnl = 0; });
      })) { render(); toast('Trade closed at recorded marks.'); }
    });
    document.querySelector('#memo-export')!.addEventListener('click', () => {
      const m = requireSaved(); if (!m) return;
      const markdown = `# ${m.title}\n\nDate: ${m.date}\nStatus: ${m.status}\nCreated: ${m.createdAt}\nUpdated: ${m.updatedAt}\nReview: ${m.reviewDate}\n${m.closedAt ? `Closed: ${m.closedAt}\n` : ''}\n${curriculum.memoFields.map(f => `## ${f.name}\n\n${m.fields[f.name] ?? ''}`).join('\n\n')}\n\n## Post-mortem\n\n${m.postMortem}\n`;
      download(`trade-memo-${m.id.slice(0, 8)}.md`, markdown, 'text/markdown');
    });
    document.querySelector('#memo-print')!.addEventListener('click', () => { const m = requireSaved(); if (m) { renderPrint(m); window.print(); } });
  }
}
