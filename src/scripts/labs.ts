import { bond, bondPnl, positionSize, portfolioVol, fxForward, scenario } from '../lib/finance';
import { escape, number, money } from './store';
import { lineChart } from './visuals';

const values = (rows: [string, string][]) => `<div class="calc-values">${rows.map(([label, value]) => `<div class="calc-value"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('')}</div>`;
const formula = (text: string) => `<div class="formula">${escape(text)}</div>`;
export function initLabs() {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')]; if (!tabs.length) return;
  const activate = (button: HTMLButtonElement) => {
    tabs.forEach(tab => { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; document.getElementById(`${tab.dataset.tab}-panel`)!.hidden = !selected; });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => { let index = i; if (e.key === 'ArrowRight') index = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length; else if (e.key === 'Home') index = 0; else if (e.key === 'End') index = tabs.length - 1; else return; e.preventDefault(); activate(tabs[index]); tabs[index].focus(); });
  });
  const calculators: Record<string, (v: Record<string, number>) => string> = {
    bond: v => {
      const b = bond(v.face, v.coupon, v.yield, v.years, v.frequency); const p = bondPnl(b.price, b.modified, b.convexity, v.shock);
      const down = bond(v.face, v.coupon, v.yield - .01, v.years, v.frequency).price;
      const up = bond(v.face, v.coupon, v.yield + .01, v.years, v.frequency).price;
      const numericDV01 = (down - up) / 2;
      const points = [-2, -1.5, -1, -.5, 0, .5, 1, 1.5, 2].filter(d => 1 + (v.yield + d) / 100 / v.frequency > 0).map(d => ({ x: `${number(v.yield + d, 1)}%`, y: bond(v.face, v.coupon, v.yield + d, v.years, v.frequency).price }));
      return values([['Bond price', number(b.price, 4)], ['Macaulay duration (years)', number(b.macaulay, 4)], ['Modified duration', number(b.modified, 4)], ['DV01 / face entered', number(b.dv01, 6)], ['Convexity', number(b.convexity, 4)], ['Approximate price P&L', number(p.total, 4)]]) + formula(`P = sum[CF_t / (1 + y/m)^(mt)] = ${number(b.price, 6)}\nD_Mac = sum[t * PV(CF_t)] / P = ${number(b.macaulay, 6)}\nD_Mod = D_Mac / (1 + y/m) = ${number(b.modified, 6)}\nDV01 = D_Mod * P * 0.0001 = ${number(b.dv01, 6)}\nNumerical DV01 = [P(y - 1bp) - P(y + 1bp)] / 2 = ${number(numericDV01, 6)}\nConvexity = sum[PV(CF_k) * k * (k+1)] / [P * m^2 * (1+y/m)^2]\nDelta y = ${v.shock} / 10,000 = ${v.shock / 10000}\nApproximate P&L = -D_Mod * P * Delta y + 0.5 * C * P * Delta y^2\n= ${number(p.linear, 6)} + ${number(p.curvature, 6)} = ${number(p.total, 6)}`) + '<h3>Price / yield sensitivity</h3>' + lineChart(points, 'Bond price versus yield') + `<details><summary>Cash-flow calculations (${b.flows.length} periods)</summary><div class="table-scroll"><table><thead><tr><th>Year</th><th>Cash flow</th><th>Discount factor</th><th>Present value</th></tr></thead><tbody>${b.flows.map(f => `<tr><td>${f.time}</td><td>${number(f.cash, 4)}</td><td>${number(f.discount, 6)}</td><td>${number(f.pv, 6)}</td></tr>`).join('')}</tbody></table></div></details>`;
    },
    sizing: v => { const r = positionSize(v.nav, v.risk, v.adverse); return values([['Loss budget', money(r.budget)], ['Position notional', money(r.notional)], ['Weight / NAV', `${number(r.weight)}%`]]) + formula(`Loss budget = NAV * risk% / 100\n= ${v.nav} * ${v.risk} / 100 = ${number(r.budget)}\nNotional = loss budget / (adverse move% / 100)\n= ${number(r.budget)} / ${v.adverse / 100} = ${number(r.notional)}\nWeight = notional / NAV = ${number(r.weight)}%`) + '<p class="method-note">Assumes a linear price return and full execution at the adverse scenario price. The loss budget is not a guaranteed maximum loss.</p>'; },
    vol: v => { const r = portfolioVol(v.w1, v.w2, v.v1, v.v2, v.rho); return values([['Annualized portfolio volatility', `${number(r.volatility, 4)}%`]]) + formula(`Variance = wA^2 * sigmaA^2 + wB^2 * sigmaB^2 + 2*wA*wB*sigmaA*sigmaB*rho\nWeights and volatilities converted to decimals.\nAsset A variance term = ${number(r.first, 8)}\nAsset B variance term = ${number(r.second, 8)}\nCovariance term = ${number(r.covariance, 8)}\nPortfolio volatility = sqrt(${number(r.first + r.second + r.covariance, 8)})\n= ${number(r.volatility, 4)}%`); },
    fx: v => { const r = fxForward(v.spot, v.domestic, v.foreign, v.years); return values([['Outright forward', number(r.forward, 6)], ['Forward minus spot', number(r.points, 6)], ['Forward premium / tenor', `${number(r.premium, 4)}%`], ['Long foreign carry / tenor (approx.)', `${number(r.carry, 4)}%`]]) + formula(`F = S * (1 + r_domestic * T) / (1 + r_foreign * T)\n= ${v.spot} * ${number(1 + v.domestic / 100 * v.years, 6)} / ${number(1 + v.foreign / 100 * v.years, 6)}\n= ${number(r.forward, 6)}\nForward points (raw quote units) = F - S = ${number(r.points, 6)}\nApprox. long-foreign interest carry = (r_foreign - r_domestic) * T\n= (${v.foreign}% - ${v.domestic}%) * ${v.years} = ${number(r.carry)}%`) + '<p class="method-note">Carry assumes unchanged spot, foreign investment funded in domestic currency, and ignores compounding. A fully hedged investment does not earn this as an arbitrage profit.</p>'; },
    scenario: v => { const keys = ['yield', 'fx', 'equity', 'commodity']; const effects = scenario(keys.map(k => v[`${k}-shock`]), keys.map(k => v[`${k}-sensitivity`])); return values([['Approximate scenario P&L (CAD)', money(effects.reduce((s, n) => s + n, 0))]]) + formula(keys.map((k, i) => `${k}: ${v[`${k}-shock`]} * ${v[`${k}-sensitivity`]} = ${money(effects[i])}`).join('\n') + `\nTotal = ${money(effects.reduce((s, n) => s + n, 0))}`); },
  };
  Object.entries(calculators).forEach(([name, calculate]) => {
    const form = document.getElementById(`${name}-form`) as HTMLFormElement;
    const run = () => {
      const result = document.getElementById(`${name}-result`)!;
      try {
        const v = Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, Number(value)]));
        if (!Object.values(v).every(Number.isFinite)) throw new Error('Enter finite numeric values.');
        const html = calculate(v); if (/NaN|Infinity/.test(html)) throw new Error('Inputs exceed the numerical range.'); result.innerHTML = html;
      } catch (err) { result.innerHTML = `<p class="error">${escape(err instanceof Error ? err.message : 'Check your inputs.')}</p>`; }
    };
    form.addEventListener('submit', e => { e.preventDefault(); run(); }); run();
  });
}
