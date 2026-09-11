# Portfolio Construction and Risk

## 1. Risk Is the Common Currency

Positions in bonds, FX, equities and commodities cannot be sensibly compared by notional value.

Translate them into risk:
- DV01;
- volatility;
- beta/factor exposure;
- scenario loss;
- basis points of NAV.

## 2. Position Sizing

Practice five methods:

### Fixed NAV risk
Set a maximum loss under a defined adverse move.

### Volatility targeting
`position_weight ∝ target_risk / asset_volatility`

### DV01 targeting
Useful for rates and curve portfolios.

### Scenario-based sizing
Size so a plausible thesis-invalidating scenario costs no more than a predetermined fraction of NAV.

### Expected-value framework
Estimate probabilities and payoffs across scenarios.

Do not treat a stop-loss as identical to thesis invalidation.

## 3. Correlation and Diversification

A portfolio with ten trades can contain one macro bet.

Example:
- long duration;
- long growth equities;
- short USD;
- long credit;
- long commodities.

Under some regimes these may all encode "benign growth/disinflation/risk-on."

For every position identify latent factors:
- growth;
- inflation;
- policy;
- duration;
- USD;
- liquidity/risk appetite;
- commodity exposure;
- volatility.

## 4. Portfolio Statistics

Implement and interpret:
- annualized return;
- annualized volatility;
- Sharpe;
- Sortino;
- maximum drawdown;
- hit rate;
- win/loss ratio;
- skew;
- correlation matrix;
- marginal contribution to risk.

Avoid optimizing to a statistic you cannot economically explain.

## 5. VaR and Expected Shortfall

Learn:
- historical VaR;
- parametric VaR;
- simulation intuition;
- confidence horizon;
- expected shortfall;
- limitations in regime changes and nonlinear portfolios.

The interview-level answer to "what is wrong with VaR?" should include that it says little about the magnitude of losses beyond the cutoff and depends heavily on assumptions/history.

## 6. Stress Testing

Maintain a stress book:
- 2008-style funding shock;
- March 2020 liquidity shock;
- 2022 inflation/rates shock;
- sharp recession;
- inflation resurgence;
- sovereign/fiscal shock;
- 10% USD rally;
- oil ±30%;
- equity -20%;
- parallel curve ±100 bp;
- curve twist.

For each scenario report:
- portfolio P&L;
- largest contributors;
- hidden concentrations;
- liquidity implications;
- likely policy response.

## 7. Risk Budget

Shadow fund starting framework:

- NAV: CAD 100m
- target annualized volatility: 6%
- soft maximum drawdown: 6%
- hard review threshold: 8%
- max risk contribution from one thesis: 20%
- max correlated-theme risk: 40%
- maintain at least 5 independent theses when fully invested

These are educational constraints, not claims about real pension mandates.
