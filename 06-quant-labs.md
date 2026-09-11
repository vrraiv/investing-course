# Quantitative Labs

These projects should be implemented in Python and exposed in the eventual local course site where useful.

## Lab 1 — Bond Calculator
Build functions for:
- price;
- YTM;
- duration;
- DV01;
- convexity.

Tests: compare analytical and numerical DV01.

## Lab 2 — Yield Curve Dashboard
Data:
- Canada;
- U.S.;
- optional UK/Germany/Japan.

Calculate:
- 2s10s;
- 5s30s;
- 2s5s10s butterfly;
- rolling z-scores;
- daily/weekly changes.

## Lab 3 — PCA of Yield Curves
Estimate principal components and interpret:
- PC1 ≈ level;
- PC2 ≈ slope;
- PC3 ≈ curvature.

Then express a historical curve move in PC space.

## Lab 4 — Central Bank Pricing
Create a table of:
- meeting dates;
- current target rate;
- implied expected rate;
- implied cumulative change;
- your forecast;
- gap vs market.

## Lab 5 — Carry/Roll Calculator
Input:
- curve;
- instrument/maturity;
- holding period.

Output:
- approximate carry;
- roll;
- breakeven adverse yield move.

## Lab 6 — FX Dashboard
Combine:
- spot;
- forward;
- carry;
- rate differentials;
- inflation differential;
- valuation;
- momentum.

Do not immediately optimize a trading rule. First learn what each signal economically represents.

## Lab 7 — Portfolio Engine
Represent every trade with:
- ID;
- entry date;
- instrument;
- thesis;
- notional;
- risk;
- entry price;
- current price;
- P&L;
- factor tags.

Output:
- NAV;
- return;
- volatility;
- drawdown;
- exposures;
- correlation;
- risk contribution.

## Lab 8 — Scenario Engine
Allow shocks to:
- yield-curve nodes;
- FX;
- equity indices;
- commodities;
- volatility.

Map shocks to approximate portfolio P&L.

## Lab 9 — Macro Surprise Index
Use release:
`surprise = (actual - consensus) / historical_surprise_std`

Aggregate thoughtfully and test relationship with asset returns.

Key lesson: a macro series and a tradable surprise are different objects.

## Lab 10 — Fair Value
Choose one:
- CAD/USD;
- Canada 10y;
- Canada-U.S. 2y spread.

Build a parsimonious model, inspect residuals, test stability and write down the economic rationale before viewing trading performance.

## Lab 11 — Backtester
Required features:
- no look-ahead;
- explicit signal lag;
- transaction costs;
- walk-forward evaluation;
- turnover;
- benchmark;
- drawdown;
- parameter sensitivity.

## Lab 12 — Attribution
Break returns into:
- trade;
- asset class;
- country;
- theme;
- directional vs relative value;
- carry vs price where feasible.

Final requirement: automatically generate a monthly PM report from the shadow-fund ledger.
