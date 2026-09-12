import test from 'node:test';
import assert from 'node:assert/strict';
import { bond, bondPnl, positionSize, portfolioVol, fxForward, pnl, portfolio, maxDrawdown, exposures, scenario, expectedValue, returnStats } from '../src/lib/finance';
import type { Position } from '../src/lib/state';
const close = (a: number, b: number, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
test('par bonds, zero coupons, and negative yields', () => {
  close(bond(100, 3, 3, 5, 1).price, 100);
  close(bond(100, 3, 3, 5, 2).price, 100);
  close(bond(100, 0, 4, 5, 1).price, 100 / 1.04 ** 5);
  close(bond(100, 0, 4, 5, 1).macaulay, 5);
  assert.ok(bond(100, 0, -1, 5, 1).price > 100);
});
test('analytical DV01 and convexity agree with finite differences', () => {
  for (const frequency of [1, 2, 4]) {
    const b = bond(100, 3, 4, 5, frequency);
    const down = bond(100, 3, 3.99, 5, frequency).price;
    const up = bond(100, 3, 4.01, 5, frequency).price;
    close(b.dv01, (down - up) / 2, 1e-7);
    close(b.convexity, (down + up - 2 * b.price) / (b.price * .0001 ** 2), 1e-5);
    const approximation = bondPnl(b.price, b.modified, b.convexity, 10);
    close(approximation.total, bond(100, 3, 4.1, 5, frequency).price - b.price, 1e-5);
  }
});
test('invalid periods and discount factors are rejected', () => {
  assert.throws(() => bond(100, 3, 4, 1.5, 1));
  assert.throws(() => bond(100, 3, -100, 5, 1));
  assert.throws(() => bond(100, 3, 4, 200, 4));
  assert.throws(() => bond(0, 3, 4, 5, 1));
});
test('position sizing, correlation limits, and covered interest parity', () => {
  close(positionSize(1e8, .5, 5).notional, 1e7);
  close(portfolioVol(50, 50, 10, 10, 1).volatility, 10);
  close(portfolioVol(50, 50, 10, 10, -1).volatility, 0);
  close(portfolioVol(100, -100, 10, 10, 1).volatility, 0);
  assert.throws(() => portfolioVol(50, 50, 10, 10, 2));
  close(fxForward(1.35, 3, 4, 1).forward, 1.35 * 1.03 / 1.04);
  close(fxForward(1.35, 4, 4, 1).points, 0);
});
test('long/short P&L, closed trades, exposure and NAV are consistent', () => {
  const long = { direction: 'long', notional: 1e6, entry_price: 100, current_price: 102, status: 'open', asset_class: 'Rates', country: 'Canada', theme: 'Easing' } as Position;
  const short = { ...long, direction: 'short', status: 'closed', current_price: 95 } as Position;
  close(pnl(long), 20000); close(pnl(short), 50000);
  const result = portfolio([long, short]);
  close(result.nav, 100070000); close(result.realized, 50000); close(result.unrealized, 20000); close(result.winRate!, 100);
  assert.deepEqual(exposures([long, short], 'theme'), [['Easing', { gross: 1e6, net: 1e6 }]]);
  assert.equal(portfolio([]).winRate, null);
});
test('drawdown includes starting NAV and orders observations chronologically', () => {
  close(maxDrawdown([{ date: '2026-01-03', nav: 9e7 }, { date: '2026-01-02', nav: 1.2e8 }])!, 25);
  close(maxDrawdown([{ date: '2026-01-01', nav: 9e7 }])!, 10);
  assert.equal(maxDrawdown([]), null);
  assert.deepEqual(scenario([50, -5, -10, 10], [-10000, 50000, 100000, 25000]), [-500000, -250000, -1000000, 250000]);
});
test('expected value normalizes probabilities and finds the modal outcome', () => {
  const r = expectedValue([{ probability: 25, payoff: 100 }, { probability: 50, payoff: 0 }, { probability: 25, payoff: -100 }]);
  close(r.expected, 0); close(r.modalPayoff, 0); close(r.probabilitySum, 100); close(r.gap, 0);
  const skewed = expectedValue([{ probability: 70, payoff: -10 }, { probability: 30, payoff: 100 }]);
  close(skewed.expected, 23); close(skewed.modalPayoff, -10); close(skewed.gap, 33);
  // Weights that do not sum to 100 are normalized rather than rejected.
  close(expectedValue([{ probability: 1, payoff: 40 }, { probability: 1, payoff: 60 }]).expected, 50);
  assert.throws(() => expectedValue([]));
  assert.throws(() => expectedValue([{ probability: -1, payoff: 10 }]));
  assert.throws(() => expectedValue([{ probability: 0, payoff: 10 }]));
});
test('return statistics separate arithmetic, geometric, volatility and Sharpe', () => {
  const flat = returnStats([5, 5, 5, 5], 4);
  close(flat.arithmetic, 5); close(flat.geometric, 5); close(flat.volatility, 0); assert.equal(flat.sharpe, null); close(flat.hitRate, 100);
  const swing = returnStats([10, -10], 12);
  close(swing.arithmetic, 0); assert.ok(swing.geometric < 0); close(swing.hitRate, 50);
  close(returnStats([100, -50], 1).geometric, 0); // grows then halves back to the start
  const annual = returnStats([2, -1, 3, 1], 4, 2);
  assert.ok(annual.annualizedVol > annual.volatility && typeof annual.sharpe === 'number');
  assert.throws(() => returnStats([5], 4));
  assert.throws(() => returnStats([5, -100], 4));
  assert.throws(() => returnStats([5, 5], 0));
});
