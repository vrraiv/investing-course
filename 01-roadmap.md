# 24-Week Roadmap

## Phase I — Think Like an Investor

### Week 1 — From Forecast to Investment Thesis
**Question:** Why can a correct economic forecast still lose money?

📖 **Full lesson:** [From Forecast to Investment Thesis](/course/week-01-forecast-to-thesis/) — textbook notes, worked examples and interactive assignments.

Learn:
- absolute forecasts vs expectations embedded in prices;
- consensus, market pricing and distributions;
- catalysts, horizons and path dependency;
- expected value vs modal forecast;
- thesis, variant perception, catalyst and invalidation;
- why timing and expression matter.

Lab:
- Select one BoC decision six months in the future.
- Write your own policy-rate distribution.
- Compare it with the path implied by available market pricing.
- Identify what would have to happen for the market or your view to be right.

Deliverable: 1-page "forecast → price → trade" memo.

Gate: Explain three ways to lose money despite correctly forecasting the terminal policy rate.

### Week 2 — Portfolio Mathematics and Shadow Fund Launch

📖 **Full lesson:** [Portfolio Mathematics and Shadow Fund Launch](/course/week-02-portfolio-math/) — textbook notes, worked examples and interactive assignments.

Learn:
- returns, log vs arithmetic returns;
- volatility, covariance and correlation;
- leverage and gross/net exposure;
- Sharpe ratio, drawdown, hit rate;
- expected return and expected loss;
- basis points of NAV.

Lab:
- Create portfolio ledger.
- Set hypothetical NAV at CAD 100m.
- Establish risk limits.
- Enter first two paper trades.

Deliverable: Shadow Fund Investment Policy Statement.

### Week 3 — Bond Mathematics
Learn:
- price/yield relationship;
- yield-to-maturity;
- duration: Macaulay and modified;
- DV01/PV01;
- convexity;
- clean/dirty price and accrued interest;
- coupon vs zero-coupon exposure.

Lab:
- Price bonds from cash flows.
- Numerically calculate DV01 and convexity.
- Compare two bonds with same maturity but different coupons.

Gate: Given a yield shock, estimate P&L before using code.

### Week 4 — The Yield Curve
Learn:
- spot, par and forward curves;
- bootstrapping intuition;
- term structure;
- expectations hypothesis;
- term premium;
- 2s10s, 5s30s and butterflies;
- level/slope/curvature.

Lab:
- Plot Canadian and U.S. curves.
- Calculate common slopes.
- Run PCA on yield changes.

Deliverable: curve regime note.

---

## Phase II — Rates Trading Toolkit

### Week 5 — Government Bond Futures
Learn:
- futures pricing;
- contract specifications;
- cheapest-to-deliver intuition;
- conversion factors;
- basis;
- DV01 hedging;
- roll and expiry.

Lab:
- Translate a desired portfolio DV01 into approximate futures contracts.
- Compare futures expression with cash-bond expression.

### Week 6 — Swaps, OIS and Policy Pricing
Learn:
- fixed/floating swaps;
- OIS;
- swap curve;
- forward-starting rates;
- meeting-date pricing;
- FRA/OIS intuition;
- swap spreads.

Lab:
- Reconstruct a simplified expected central-bank path.
- Translate policy scenarios into front-end rates implications.

Deliverable: BoC/Fed pricing dashboard.

### Week 7 — Carry, Roll and Curve Trades
Learn:
- carry;
- rolldown;
- forward curve;
- steepeners/flatteners;
- bull vs bear curve moves;
- DV01-neutral curve trades;
- butterfly structures.

Lab:
- Calculate approximate carry/roll for several positions.
- Design one steepener and one butterfly with balanced risk.

### Week 8 — Cross-Market Rates
Learn:
- Canada vs U.S.;
- Germany/UK/Japan as G10 extensions;
- hedged vs unhedged yield differences;
- relative monetary-policy cycles;
- cross-market spread trades;
- correlation and basis risk.

Deliverable: Canada–U.S. relative-value trade memo.

Midterm: defend the trade orally for 10 minutes, then write the strongest bear case.

---

## Phase III — Broader Global Macro Toolkit

### Week 9 — FX Fundamentals
Learn:
- spot, forwards and forward points;
- covered interest parity;
- carry;
- real exchange rates;
- valuation vs catalyst;
- balance of payments;
- terms of trade;
- intervention.

Lab: Build G10 FX dashboard.

### Week 10 — FX Trade Construction
Learn:
- directional vs relative expressions;
- crosses;
- carry/valuation/momentum;
- rate-differential exposure;
- event risk;
- position sizing.

Deliverable: CAD trade with at least three possible expressions and a reason for choosing one.

### Week 11 — Inflation Markets
Learn:
- nominal vs real yields;
- breakevens;
- inflation swaps conceptually;
- inflation risk premium;
- carry/seasonality;
- oil and inflation;
- central-bank credibility.

Lab: decompose nominal-rate narratives into real-rate and inflation components.

### Week 12 — Cross-Asset Macro
Learn:
- discount rates and equities;
- credit spreads;
- commodities;
- gold;
- USD and global financial conditions;
- growth/inflation regimes;
- correlations that change by regime.

Deliverable: macro regime map with expected asset behavior and failure modes.

---

## Phase IV — Portfolio Construction and Risk

### Week 13 — Position Sizing
Learn:
- conviction is not sizing;
- volatility targeting;
- DV01 targeting;
- stop-loss vs thesis invalidation;
- expected-value sizing;
- Kelly criterion as a conceptual upper bound;
- liquidity.

Lab: size the same thesis five different ways.

### Week 14 — Portfolio Risk
Learn:
- marginal and component risk;
- covariance;
- diversification;
- concentration;
- factor exposure;
- beta;
- VaR and Expected Shortfall;
- stress tests.

Lab: build portfolio risk report.

### Week 15 — Scenario Analysis
Learn:
- historical vs hypothetical stress;
- nonlinear responses;
- correlated shocks;
- policy scenarios;
- growth/inflation quadrants;
- narrative consistency.

Exercise: recession, inflation resurgence, fiscal shock, risk-off crisis.

### Week 16 — Portfolio Construction
Learn:
- risk budgeting;
- mean-variance optimization and its fragility;
- risk parity;
- constraints;
- robust optimization intuition;
- discretionary overlays.

Deliverable: 5–10 position macro portfolio with explicit risk budget.

---

## Phase V — Building Repeatable Edge

### Week 17 — Macro Research as Signal
Learn:
- nowcasts vs asset-return forecasts;
- surprise indices;
- revisions;
- level vs change vs second derivative;
- data vintages;
- avoiding look-ahead bias.

Lab: construct a simple macro surprise signal.

### Week 18 — Fair Value Models
Learn:
- explanatory vs predictive models;
- equilibrium concepts;
- residuals;
- z-scores;
- unstable coefficients;
- structural breaks;
- combining valuation and catalyst.

Lab: rates or FX fair-value model.

### Week 19 — Backtesting
Learn:
- train/test splits;
- walk-forward tests;
- transaction costs;
- turnover;
- overfitting;
- multiple testing;
- look-ahead/survivorship bias;
- economic rationale.

Lab: backtest one simple macro strategy.

### Week 20 — Systematic + Discretionary
Learn:
- signals as inputs rather than dictators;
- ensembles;
- regime filters;
- model confidence;
- discretionary overrides;
- documenting overrides.

Deliverable: investment process describing where models enter and where judgment enters.

---

## Phase VI — Institutional PM Practice

### Week 21 — P&L Attribution
Learn:
- realized/unrealized P&L;
- carry vs mark-to-market;
- factor attribution;
- thesis attribution;
- sizing vs selection;
- luck vs process.

Lab: perform attribution on shadow portfolio.

### Week 22 — Investment Committee Communication
Learn:
- 30-second thesis;
- one-page memo;
- risk-first communication;
- answering "what changes your mind?";
- defending sizing;
- separating confidence from certainty.

Exercise: record 5-minute pitch and hostile Q&A.

### Week 23 — Institutional Context
Learn:
- pension liabilities;
- liquidity;
- total-fund risk;
- reference portfolios;
- strategic vs tactical allocation;
- currency hedging;
- private-asset interactions;
- governance and delegated risk.

Deliverable: explain how your macro portfolio contributes to a pension total fund rather than existing as a standalone hedge fund.

### Week 24 — Capstone
Submit:
- investment philosophy;
- shadow-fund track record;
- risk report;
- attribution;
- 6 case studies;
- current portfolio;
- one new trade;
- one losing-trade post-mortem;
- quantitative research example.

Final exercise: 30-minute mock PM interview / investment committee.
