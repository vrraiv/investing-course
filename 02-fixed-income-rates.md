# Fixed Income and Rates

## 1. Bond Mathematics

You should be able to derive and use:

- present value of fixed cash flows;
- yield-to-maturity;
- Macaulay duration;
- modified duration;
- DV01/PV01;
- convexity.

### Core relationship

For a small yield change:

`ΔP ≈ -ModifiedDuration × P × Δy`

and, using DV01:

`P&L ≈ -DV01 × change_in_yield_bp`

Convexity improves the approximation for larger moves.

### Exercises

1. Price a 5-year 3% annual coupon bond at yields of 2%, 3%, 4%, and 5%.
2. Calculate its DV01 numerically by bumping yield ±1 bp.
3. Repeat for a zero-coupon bond.
4. Explain why equal market values do not imply equal rate risk.
5. Construct a CAD 10m portfolio with a target DV01.

## 2. Curve Language

Master:
- spot rates;
- par yields;
- forward rates;
- instantaneous-forward intuition;
- curve steepening/flattening;
- bull/bear steepeners and flatteners;
- butterflies.

For every curve move, answer:
1. Which maturities move?
2. In which direction?
3. Why?
4. Is the position DV01-neutral?
5. What does it earn/lose from carry and roll if nothing happens?

## 3. Rates Instruments

### Cash bonds
Know coupon, maturity, settlement, accrued interest, benchmark/on-the-run status and liquidity.

### Futures
Understand:
- standardized exposure;
- margin;
- contract DV01;
- delivery basket;
- cheapest-to-deliver;
- conversion factor;
- basis;
- expiry/roll.

### Interest-rate swaps
Understand economically:
- pay fixed / receive floating = short duration;
- receive fixed / pay floating = long duration;
- swap rates reflect expected floating rates plus market premia;
- collateral and discounting matter institutionally.

### OIS
Treat OIS as the central instrument for understanding expected overnight policy paths.

### Required capability

Given:
- your BoC forecast;
- current OIS pricing;
- a 6-month horizon;

you should be able to identify whether the disagreement is about:
- number of cuts/hikes;
- timing;
- terminal rate;
- distribution/tail risk;

and then propose an appropriate expression.

## 4. Carry and Roll

A position can make or lose money even if your macro view does not materialize.

Separate:
- **carry:** income/cost from holding;
- **roll:** valuation effect from moving along the curve through time;
- **directional P&L:** market repricing;
- **financing/basis:** implementation effects.

Every trade memo must include expected carry/roll over its intended horizon.

## 5. Relative Value

Progress from:

**Outright:** "Canada 10y yields will fall."

to:

**Curve:** "Canada 2s10s will steepen."

to:

**Cross-market:** "Canadian front-end rates will outperform U.S. front-end rates."

The latter expressions can isolate your actual informational advantage.

## 6. Rates PM Checklist

Before putting on a rates trade:
- What exactly is priced?
- What is my distribution?
- Where is the disagreement?
- Which point on the curve expresses it?
- Outright or relative value?
- DV01?
- Carry/roll?
- Catalyst?
- Liquidity?
- Correlation with existing positions?
- Stop/invalidation?
- What happens if I am right eventually but wrong first?
