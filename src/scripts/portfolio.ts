import { today, type Position } from '../lib/state';
import { portfolio, pnl, exposures, maxDrawdown } from '../lib/finance';
import { state, update, toast, escape, empty, money, number, field, fill, formValues, setText } from './store';
import { lineChart } from './visuals';

export function initPortfolio(icons: () => void) {
  if (!document.querySelector('#portfolio')) return;
  const dialog = document.querySelector<HTMLDialogElement>('#position-dialog')!;
  const form = document.querySelector<HTMLFormElement>('#position-form')!;
  const group = document.querySelector<HTMLSelectElement>('#exposure-group')!;
  const mutable = ['trade_id', 'current_price', 'review_date', 'notes', 'close_position'];
  const render = () => {
    const summary = portfolio(state.positions);
    setText('portfolio-nav', money(summary.nav)); setText('portfolio-return', `${number(summary.returnPercent)}%`);
    setText('portfolio-realized', money(summary.realized)); setText('portfolio-unrealized', money(summary.unrealized));
    document.querySelector('#position-list')!.innerHTML = state.positions.map(p => `<tr><td><strong>${escape(p.instrument)}</strong><small>${escape(p.theme)} / ${escape(p.country)}</small></td><td><span class="tag">${p.status.toUpperCase()}</span><small>${p.direction.toUpperCase()}</small></td><td>${money(p.notional)}</td><td>${number(p.entry_price, 4)}<small>${number(p.current_price, 4)}</small></td><td class="${pnl(p) >= 0 ? 'positive' : 'negative'}">${money(pnl(p))}</td><td><button class="icon-button" data-position="${escape(p.trade_id)}" title="${p.status === 'closed' ? 'View closed position' : 'Review position'}" aria-label="${p.status === 'closed' ? 'View closed position' : 'Review position'}"><i data-lucide="${p.status === 'closed' ? 'files' : 'pencil'}"></i></button></td></tr>`).join('') || '<tr><td colspan="6">No positions. Save a trade memo to open your first position.</td></tr>';
    const rows = exposures(state.positions, group.value as 'theme');
    const total = rows.reduce((s, [, r]) => s + r.gross, 0);
    document.querySelector('#exposure-list')!.innerHTML = rows.map(([name, r]) => `<div class="exposure-row"><strong>${escape(name)}</strong><span>Gross ${money(r.gross)}</span><progress max="100" value="${r.gross / total * 100}" aria-label="${escape(name)} share of gross notional"></progress><span>Net ${money(r.net)}</span><span>${number(r.gross / total * 100, 1)}% of gross</span></div>`).join('') || empty('No open exposure', 'Exposure is grouped from your open positions.');
    const dd = maxDrawdown(state.navHistory);
    setText('portfolio-stats', `Win rate: ${summary.winRate == null ? '--' : `${number(summary.winRate, 1)}%`} / Max recorded drawdown: ${dd == null ? '--' : `${number(dd)}%`}`);
    const history = [...state.navHistory].sort((a, b) => a.date.localeCompare(b.date));
    document.querySelector('#nav-chart')!.innerHTML = history.length ? lineChart(history.map(p => ({ x: p.date, y: p.nav })), 'Recorded NAV (CAD)', n => `${number(n / 1e6, 2)}m`) : empty('No NAV observations', 'Record a snapshot after marking your positions.');
    document.querySelector('#nav-history')!.innerHTML = history.length ? `<details><summary>Recorded observations (${history.length})</summary>${history.map(p => `<div class="entry-row">${escape(p.date)} / ${money(p.nav)}</div>`).join('')}</details>` : '';
    icons();
  };
  const open = (p?: Position) => {
    form.reset();
    form.querySelectorAll<HTMLInputElement>('input, select, textarea, button').forEach(el => { el.disabled = false; });
    document.querySelector('#position-memo')!.innerHTML = `<option value="">Select a saved memo</option>${state.memos.filter(m => m.status === 'open' || m.id === p?.memo_id).map(m => `<option value="${escape(m.id)}">${escape(m.title)}</option>`).join('')}${p && !state.memos.some(m => m.id === p.memo_id) ? `<option value="${escape(p.memo_id)}">${escape(p.memo_snapshot.title)}</option>` : ''}`;
    if (p) {
      fill(form, p); setText('position-title', `${p.status === 'closed' ? 'Closed' : 'Review'}: ${p.instrument}`);
      form.querySelectorAll<HTMLInputElement>('input, select, textarea').forEach(el => { el.disabled = p.status === 'closed' || !mutable.includes(el.name); });
      form.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled = p.status === 'closed';
    } else { field(form, 'trade_id').value = ''; field(form, 'review_date').value = today(); setText('position-title', 'New position'); }
    dialog.showModal();
  };
  document.querySelector('#position-new')!.addEventListener('click', () => { if (!state.memos.some(m => m.status === 'open')) { toast('Create and save an open trade memo first.'); return; } open(); });
  document.querySelector('#position-cancel')!.addEventListener('click', () => dialog.close());
  document.querySelector('#position-list')!.addEventListener('click', e => { const button = (e.target as Element).closest<HTMLElement>('[data-position]'); if (button) open(state.positions.find(p => p.trade_id === button.dataset.position)); });
  field(form, 'memo_id').addEventListener('change', () => {
    const memo = state.memos.find(m => m.id === field(form, 'memo_id').value); if (!memo) return;
    fill(form, { thesis: memo.fields.Thesis ?? '', market_pricing: memo.fields['Current pricing'] ?? '', catalyst: memo.fields.Catalyst ?? '', invalidation: memo.fields.Invalidation ?? '', target: memo.fields['Exit plan'] ?? '', instrument: memo.fields.Expression ?? '' });
  });
  form.addEventListener('submit', e => {
    e.preventDefault(); const v = formValues(form); const old = state.positions.find(p => p.trade_id === v.trade_id);
    if (old?.status === 'closed') return;
    let p: Position;
    if (old) p = { ...old, current_price: Number(v.current_price), review_date: v.review_date, notes: v.notes };
    else {
      const memo = state.memos.find(m => m.id === v.memo_id && m.status === 'open'); if (!memo) { toast('Select an open memo.', true); return; }
      p = { trade_id: crypto.randomUUID(), opened_at: new Date().toISOString(), status: 'open', memo_id: memo.id, memo_snapshot: structuredClone(memo), theme: v.theme.trim(), country: v.country.trim(), asset_class: v.asset_class, instrument: v.instrument.trim(), direction: v.direction as 'long' | 'short', notional: Number(v.notional), entry_price: Number(v.entry_price), current_price: Number(v.current_price), dv01: Number(v.dv01), vol_target: Number(v.vol_target), thesis: v.thesis, market_pricing: v.market_pricing, catalyst: v.catalyst, invalidation: v.invalidation, target: v.target, review_date: v.review_date, carry_estimate: Number(v.carry_estimate), bull_pnl: Number(v.bull_pnl), base_pnl: Number(v.base_pnl), bear_pnl: Number(v.bear_pnl), realized_pnl: 0, unrealized_pnl: 0, notes: v.notes };
    }
    if (v.close_position === 'on') { if (!confirm('Close this position permanently at the entered exit price?')) return; p.status = 'closed'; p.closed_at = new Date().toISOString(); }
    p.realized_pnl = p.status === 'closed' ? pnl(p) : 0; p.unrealized_pnl = p.status === 'open' ? pnl(p) : 0;
    if (update(s => { const index = s.positions.findIndex(x => x.trade_id === p.trade_id); if (index >= 0) s.positions[index] = p; else s.positions.push(p); })) { dialog.close(); render(); toast('Position saved.'); }
  });
  document.querySelector('#nav-snapshot')!.addEventListener('click', () => {
    const date = today(); if (state.navHistory.some(p => p.date === date) && !confirm('Replace today\'s NAV snapshot with the current marked NAV?')) return;
    if (update(s => { s.navHistory = s.navHistory.filter(p => p.date !== date); s.navHistory.push({ date, nav: portfolio(s.positions).nav }); })) { render(); toast('NAV snapshot recorded.'); }
  });
  group.addEventListener('change', render); render();
}
