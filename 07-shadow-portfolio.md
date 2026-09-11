# Shadow Global Macro Fund

## Mandate

Manage a simulated **CAD 100 million liquid global macro portfolio**.

Primary universe:
- Canada/U.S. government rates;
- G10 rates as data access improves;
- G10 FX;
- equity-index futures conceptually;
- major commodities conceptually;
- options after Week 12.

The portfolio exists to demonstrate process, not to maximize paper returns.

## Objectives

- positive risk-adjusted return;
- target volatility: 6% annualized;
- preserve capital;
- maintain diversified sources of return;
- prioritize trades linked to identifiable macro edge.

## Rules

Every trade requires:
1. timestamped memo;
2. market pricing at entry;
3. thesis;
4. catalyst;
5. alternative expressions;
6. size/risk;
7. scenario P&L;
8. invalidation;
9. intended horizon.

No retroactive trades.

No changing entry assumptions after observing outcomes.

If reliable historical market data are unavailable, explicitly mark approximations.

## Ledger Schema

```text
trade_id
opened_at
closed_at
status
theme
country
asset_class
instrument
direction
notional
entry_price
current_price
dv01
vol_target
thesis
market_pricing
catalyst
invalidation
target
review_date
carry_estimate
bull_pnl
base_pnl
bear_pnl
realized_pnl
unrealized_pnl
notes
```

## Risk Meeting

Once weekly answer:
- What are my top three risks?
- Which positions express the same underlying thesis?
- Where would I lose most in a 2-sigma move?
- What event matters most next week?
- Which position has the weakest expected return per unit of risk?
- What has changed enough that I should exit?

## Monthly Letter

Maximum two pages:
1. performance;
2. major contributors/detractors;
3. portfolio positioning;
4. macro view;
5. mistakes;
6. outlook.

Do not write a generic economic forecast. Every macro observation should connect to a portfolio implication.

## Track Record Integrity

Keep two records:
- **actual shadow portfolio:** immutable historical decisions;
- **research portfolio:** backtests and hypothetical alternatives.

Never mix them.
