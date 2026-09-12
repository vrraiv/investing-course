import { expectedValue, returnStats } from '../lib/finance';
import { escape, number } from './store';
import { lineChart } from './visuals';

// Interactive lesson widgets. Each mounts into an empty <div data-widget="name"> placed
// in the curriculum Markdown, so the prose stays in the .md files and the behaviour stays here.
// Nothing is persisted: these are exploratory practice tools, like the calculators in /labs/.

const values = (rows: [string, string][]) => `<div class="calc-values">${rows.map(([label, value]) => `<div class="calc-value"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('')}</div>`;
const note = (text: string) => `<p class="method-note">${escape(text)}</p>`;

type Row = { label: string; probability: number; payoff: number };
interface DistConfig {
  title: string;
  unit: string;
  payoffLabel: string;
  rows: Row[];
  reference?: { label: string; value: number };
  outcome: string; // wording for the expected figure, e.g. "Expected outcome"
  gapNote: (gap: number, unit: string) => string;
}

const distConfigs: Record<string, DistConfig> = {
  'policy-distribution': {
    title: 'Your policy-rate distribution vs. the market',
    unit: 'bp',
    payoffLabel: 'Rate change (bp)',
    outcome: 'Your expected change',
    rows: [
      { label: 'Two cuts (−50 bp)', probability: 10, payoff: -50 },
      { label: 'One cut (−25 bp)', probability: 45, payoff: -25 },
      { label: 'Hold (0 bp)', probability: 35, payoff: 0 },
      { label: 'One hike (+25 bp)', probability: 10, payoff: 25 },
    ],
    reference: { label: 'Market-implied change (bp)', value: -18 },
    gapNote: (gap) => `Variant perception: your mean is ${number(gap, 1)} bp away from what the market prices. A trade only exists if you can say why the market is wrong and what makes it converge.`,
  },
  'expected-value': {
    title: 'Expected value vs. the modal outcome',
    unit: 'bp of NAV',
    payoffLabel: 'P&L (bp of NAV)',
    outcome: 'Expected value',
    rows: [
      { label: 'Bull', probability: 25, payoff: 120 },
      { label: 'Base', probability: 50, payoff: 15 },
      { label: 'Bear', probability: 25, payoff: -140 },
    ],
    gapNote: (gap) => `The expected value is ${number(gap, 1)} bp of NAV away from the single most likely outcome. Sizing off the modal case alone ignores the tails that actually decide the trade.`,
  },
};

function mountDistribution(el: HTMLElement, cfg: DistConfig) {
  const unit = el.dataset.unit ?? cfg.unit;
  const title = el.dataset.title ?? cfg.title;
  const form = document.createElement('form');
  form.className = 'lesson-widget-body';
  form.innerHTML = `<h4>${escape(title)}</h4>`
    + `<div class="table-scroll"><table><thead><tr><th>Scenario</th><th>Probability (%)</th><th>${escape(cfg.payoffLabel)}</th></tr></thead><tbody>`
    + cfg.rows.map((r, i) => `<tr><th>${escape(r.label)}</th><td><label class="sr-inline"><span class="sr-only">${escape(r.label)} probability</span><input type="number" name="p${i}" value="${r.probability}" min="0" step="any" required></label></td><td><label class="sr-inline"><span class="sr-only">${escape(r.label)} payoff</span><input type="number" name="v${i}" value="${r.payoff}" step="any" required></label></td></tr>`).join('')
    + '</tbody></table></div>'
    + (cfg.reference ? `<label class="widget-reference">${escape(cfg.reference.label)}<input type="number" name="ref" value="${cfg.reference.value}" step="any"></label>` : '')
    + `<div class="calculation-result" aria-live="polite"></div>`;
  el.replaceChildren(form);
  const result = form.querySelector<HTMLElement>('.calculation-result')!;
  const run = () => {
    try {
      const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, Number(v)]));
      const rows = cfg.rows.map((r, i) => ({ probability: data[`p${i}`], payoff: data[`v${i}`] }));
      const r = expectedValue(rows);
      const rows2: [string, string][] = [
        [`${cfg.outcome} (${unit})`, number(r.expected, 1)],
        [`Most likely outcome (${unit})`, number(r.modalPayoff, 1)],
        ['Probabilities sum to', `${number(r.probabilitySum, 1)}%`],
      ];
      if (cfg.reference && Number.isFinite(data.ref)) rows2.push([`vs. reference (${unit})`, number(r.expected - data.ref, 1)]);
      let html = values(rows2);
      if (Math.abs(r.probabilitySum - 100) > 0.5) html += note(`Probabilities sum to ${number(r.probabilitySum, 1)}%, not 100%. They are normalized for the expected value, but a real distribution should account for every outcome.`);
      html += note((cfg.reference && Number.isFinite(data.ref) ? cfg.gapNote(r.expected - data.ref, unit) : cfg.gapNote(r.gap, unit)));
      result.innerHTML = html;
    } catch (err) {
      result.innerHTML = `<p class="error">${escape(err instanceof Error ? err.message : 'Check your inputs.')}</p>`;
    }
  };
  form.addEventListener('input', run);
  form.addEventListener('submit', e => e.preventDefault());
  run();
}

function mountReturnStats(el: HTMLElement) {
  const title = el.dataset.title ?? 'Returns, volatility and Sharpe';
  const form = document.createElement('form');
  form.className = 'lesson-widget-body';
  form.innerHTML = `<h4>${escape(title)}</h4>`
    + `<label>Per-period returns (%), comma or space separated<textarea name="returns" rows="2">${escape(el.dataset.returns ?? '2.1, -1.4, 3.0, 0.8, -2.6, 1.9, 2.4, -0.7, 1.1, 3.3, -1.8, 2.0')}</textarea></label>`
    + `<div class="form-grid"><label>Periods per year<input type="number" name="periods" value="${escape(el.dataset.periods ?? '12')}" min="0.1" step="any" required></label><label>Risk-free rate (% / year)<input type="number" name="rf" value="0" step="any" required></label></div>`
    + `<div class="calculation-result" aria-live="polite"></div>`;
  el.replaceChildren(form);
  const result = form.querySelector<HTMLElement>('.calculation-result')!;
  const run = () => {
    try {
      const raw = String(new FormData(form).get('returns') ?? '');
      const returns = raw.split(/[\s,]+/).filter(Boolean).map(Number);
      if (!returns.length || returns.some(n => !Number.isFinite(n))) throw new Error('Enter finite numbers separated by commas or spaces.');
      const periods = Number(new FormData(form).get('periods'));
      const rf = Number(new FormData(form).get('rf'));
      const s = returnStats(returns, periods, rf);
      let nav = 100;
      const path = [{ x: '0', y: 100 }, ...returns.map((r, i) => { nav *= 1 + r / 100; return { x: String(i + 1), y: nav }; })];
      result.innerHTML = values([
        ['Arithmetic mean / period', `${number(s.arithmetic, 2)}%`],
        ['Geometric (compound) / period', `${number(s.geometric, 2)}%`],
        ['Volatility / period', `${number(s.volatility, 2)}%`],
        ['Annualized return', `${number(s.annualizedReturn, 2)}%`],
        ['Annualized volatility', `${number(s.annualizedVol, 2)}%`],
        ['Annualized Sharpe', s.sharpe === null ? 'n/a (zero vol)' : number(s.sharpe, 2)],
        ['Hit rate', `${number(s.hitRate, 1)}%`],
        ['Total compounded growth', `${number(s.totalGrowth, 2)}%`],
      ]) + '<h4>Growth of 100 (compounded path)</h4>' + lineChart(path, 'Compounded NAV path', n => number(n, 1))
        + note('Arithmetic mean overstates realized growth whenever returns vary: the geometric mean is what a NAV actually compounds at. Sharpe annualizes the geometric return over the annualized volatility; it rewards steadiness, not just size.');
    } catch (err) {
      result.innerHTML = `<p class="error">${escape(err instanceof Error ? err.message : 'Check your inputs.')}</p>`;
    }
  };
  form.addEventListener('input', run);
  form.addEventListener('submit', e => e.preventDefault());
  run();
}

export function initWidgets() {
  const host = document.querySelector('#lesson-content');
  if (!host) return;
  host.querySelectorAll<HTMLElement>('[data-widget]').forEach(el => {
    const name = el.dataset.widget!;
    if (name === 'return-stats') mountReturnStats(el);
    else if (distConfigs[name]) mountDistribution(el, distConfigs[name]);
  });
}
