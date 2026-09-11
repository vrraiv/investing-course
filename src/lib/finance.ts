import type { Position } from './state';

export const INITIAL_NAV = 100_000_000;
export function bond(face: number, couponPercent: number, yieldPercent: number, years: number, frequency: number) {
  const periods = years * frequency;
  if (![face, couponPercent, yieldPercent, years, frequency].every(Number.isFinite) || face <= 0 || couponPercent < 0 || years <= 0 || ![1, 2, 4].includes(frequency) || !Number.isInteger(periods) || periods > 400 || 1 + yieldPercent / 100 / frequency <= 0) throw new Error('Use positive face and maturity, nonnegative coupon, whole coupon periods (up to 400), and yield above -100% per period.');
  const rate = yieldPercent / 100 / frequency;
  const coupon = face * couponPercent / 100 / frequency;
  const flows = Array.from({ length: periods }, (_, i) => {
    const period = i + 1;
    const cash = coupon + (period === periods ? face : 0);
    return { period, time: period / frequency, cash, discount: (1 + rate) ** -period, pv: cash / (1 + rate) ** period };
  });
  const price = flows.reduce((s, f) => s + f.pv, 0);
  const macaulay = flows.reduce((s, f) => s + f.time * f.pv, 0) / price;
  const modified = macaulay / (1 + rate);
  const convexity = flows.reduce((s, f) => s + f.pv * f.period * (f.period + 1), 0) / (price * frequency ** 2 * (1 + rate) ** 2);
  if (![price, macaulay, modified, convexity].every(Number.isFinite)) throw new Error('Inputs exceed the numerical range.');
  return { price, macaulay, modified, convexity, dv01: modified * price * 0.0001, flows };
}
export function bondPnl(price: number, duration: number, convexity: number, bp: number) {
  const dy = bp / 10000;
  const linear = -duration * price * dy;
  const curvature = 0.5 * convexity * price * dy ** 2;
  return { linear, curvature, total: linear + curvature };
}
export function positionSize(nav: number, riskPercent: number, adversePercent: number) {
  if (nav <= 0 || riskPercent < 0 || adversePercent <= 0) throw new Error('NAV and adverse move must be positive.');
  const budget = nav * riskPercent / 100;
  return { budget, notional: budget / (adversePercent / 100), weight: riskPercent / adversePercent * 100 };
}
export function portfolioVol(w1: number, w2: number, v1: number, v2: number, rho: number) {
  if (Math.abs(rho) > 1 || v1 < 0 || v2 < 0) throw new Error('Correlation must be between -1 and 1, with nonnegative volatilities.');
  const first = (w1 / 100 * v1 / 100) ** 2;
  const second = (w2 / 100 * v2 / 100) ** 2;
  const covariance = 2 * w1 / 100 * w2 / 100 * v1 / 100 * v2 / 100 * rho;
  const a = w1 / 100 * v1 / 100;
  const b = w2 / 100 * v2 / 100;
  // Factor the covariance matrix to avoid cancellation for perfect hedges.
  const variance = (a + rho * b) ** 2 + b ** 2 * (1 - rho ** 2);
  return { first, second, covariance, volatility: Math.sqrt(variance) * 100 };
}
export function fxForward(spot: number, domestic: number, foreign: number, years: number) {
  if (spot <= 0 || years <= 0 || 1 + foreign / 100 * years <= 0 || 1 + domestic / 100 * years <= 0) throw new Error('Use positive spot and tenor, with positive interest accrual factors.');
  const forward = spot * (1 + domestic / 100 * years) / (1 + foreign / 100 * years);
  return { forward, points: forward - spot, premium: (forward / spot - 1) * 100, carry: (foreign - domestic) * years };
}
export function pnl(p: Pick<Position, 'direction' | 'notional' | 'current_price' | 'entry_price'>) {
  return (p.direction === 'long' ? 1 : -1) * p.notional * (p.current_price / p.entry_price - 1);
}
export function portfolio(positions: Position[]) {
  let realized = 0, unrealized = 0;
  positions.forEach(p => { if (p.status === 'closed') realized += pnl(p); else unrealized += pnl(p); });
  const closed = positions.filter(p => p.status === 'closed');
  return { nav: INITIAL_NAV + realized + unrealized, realized, unrealized, returnPercent: (realized + unrealized) / INITIAL_NAV * 100, winRate: closed.length ? closed.filter(p => pnl(p) > 0).length / closed.length * 100 : null };
}
export function maxDrawdown(history: { date: string; nav: number }[]) {
  if (!history.length) return null;
  let peak = INITIAL_NAV, max = 0;
  [...history].sort((a, b) => a.date.localeCompare(b.date)).forEach(p => { peak = Math.max(peak, p.nav); max = Math.max(max, (peak - p.nav) / peak); });
  return max * 100;
}
export function exposures(positions: Position[], group: 'asset_class' | 'country' | 'theme') {
  const result = new Map<string, { gross: number; net: number }>();
  positions.filter(p => p.status === 'open').forEach(p => {
    const row = result.get(p[group]) ?? { gross: 0, net: 0 };
    row.gross += p.notional;
    row.net += p.notional * (p.direction === 'long' ? 1 : -1);
    result.set(p[group], row);
  });
  return [...result.entries()];
}
export function scenario(shocks: number[], sensitivities: number[]) {
  return shocks.map((shock, i) => shock * sensitivities[i]);
}
