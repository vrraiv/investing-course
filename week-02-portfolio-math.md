---
title: "Week 2 — Portfolio Mathematics and Shadow Fund Launch"
week: 2
phase: "I"
estimated_hours: 6
prerequisites: ["week-1"]
---

# Week 2 — Portfolio Mathematics and Shadow Fund Launch

Last week you turned a forecast into a thesis. This week you learn the **language every thesis is eventually measured in** — returns, volatility, correlation, Sharpe, drawdown — and you **launch the shadow fund** that will carry your track record for the rest of the course. From today you are running money (on paper), and running money means measuring it honestly.

> [!CONCEPT]
> Notional value is a vanity number. A CAD 50m bond position and a CAD 50m equity position are not the same bet — they carry different risk, and risk, not notional, is the currency an investor budgets. This week converts everything to that common currency.

## Learning objectives

By the end of this week you should be able to:

1. Compute arithmetic and geometric (log) returns and explain when each is appropriate.
2. Compute volatility, and reason about covariance and correlation between positions.
3. Explain leverage and gross vs. net exposure.
4. Compute and interpret the Sharpe ratio, maximum drawdown, and hit rate.
5. Express any position and any P&L in **basis points of NAV**.
6. Write a Shadow Fund Investment Policy Statement and enter your first two paper trades.

---

## 1. Returns: arithmetic vs. geometric

There are two ways to average returns, and confusing them is one of the most expensive mistakes in finance.

- **Arithmetic mean:** the simple average of period returns. Good for estimating a *single period's expected* return.
- **Geometric (compound) mean:** the constant rate that reproduces the actual cumulative growth. This is what your NAV *actually* compounds at.

The gap between them is driven by volatility, and it is always in the same direction:

> [!WARNING]
> The geometric return is always **less than** the arithmetic return whenever returns vary — and the gap grows with volatility (roughly `geometric ≈ arithmetic − ½ × variance`). A fund that makes +50% then −50% has an arithmetic mean of 0% but has actually **lost 25%** (1.5 × 0.5 = 0.75). Volatility is not just risk; it is a direct tax on compounding.

Worked example: returns of `+10%` then `−10%`.

- Arithmetic mean = `(10 − 10) / 2 = 0%`.
- Actual growth = `1.10 × 0.90 = 0.99` → you are down **1%**.
- Geometric mean = `0.99^(1/2) − 1 ≈ −0.50%` per period.

**Log returns** (`ln(1 + r)`) are the analyst's tool for this: they add across time instead of multiplying, so a sum of log returns gives cumulative growth directly, and they are roughly symmetric for small moves. Institutions quote arithmetic returns to clients but reason in log/geometric terms internally.

---

## 2. Volatility, covariance, correlation

**Volatility** is the standard deviation of returns — a measure of dispersion, usually *annualized* by multiplying the per-period volatility by `√(periods per year)` (the "square-root-of-time" rule). Twelve monthly observations with a 2% monthly standard deviation imply roughly `2% × √12 ≈ 6.9%` annualized.

**Covariance** and **correlation** measure how two positions move *together*. Correlation is covariance scaled to lie in `[−1, +1]`. It is the hinge of portfolio construction: two positions with correlation +1 are one position held twice; two positions with correlation −1 hedge each other; two uncorrelated positions genuinely diversify.

The tool below takes a series of period returns and computes the whole set — arithmetic vs. geometric mean, per-period and annualized volatility, Sharpe, hit rate — and plots the compounded growth path so you can *see* the volatility tax at work. Edit the returns and watch the geometric mean fall away from the arithmetic mean as you make the series choppier.

<div class="lesson-widget" data-widget="return-stats"></div>

> [!EXERCISE]
> Enter two series with the **same arithmetic mean** but different volatility (e.g. `2,2,2,2` vs. `10,-6,10,-6`). Confirm that the choppier series has a lower geometric mean and a lower Sharpe even though the simple average is identical. Write one sentence in your **journal** explaining why an investor prefers the smoother path.

---

## 3. Sharpe, drawdown, hit rate

Three numbers summarize a track record. Learn what each hides.

- **Sharpe ratio** = `(annualized return − risk-free rate) / annualized volatility`. Return per unit of risk. A Sharpe of 1.0 is respectable for a discretionary macro book; 2.0+ over a long sample is exceptional and usually too good to be true. Sharpe rewards *steadiness*, not size — which is why volatility control is a return strategy, not just a risk strategy.
- **Maximum drawdown** = the largest peak-to-trough fall in NAV. It is what actually ends careers and redemptions: a 6% annualized volatility can still produce a 15% drawdown in a bad regime. Sharpe describes the average path; drawdown describes the worst one.
- **Hit rate** = the fraction of trades (or periods) that make money. It is the most *over-weighted* statistic. A 40% hit rate with good asymmetry (small losses, large wins) beats a 70% hit rate that gives it all back in the tails. Hit rate without payoff size is meaningless.

> [!PM QUESTION]
> "Two managers both returned 8% last year. How do you tell them apart?" — Ask for volatility, Sharpe, and maximum drawdown; then ask *how* the return was made (a few large asymmetric wins vs. many small carry trades) and whether it was one bet or many independent ones. The return number alone tells you almost nothing.

---

## 4. Leverage, exposure, and basis points of NAV

Macro portfolios use **leverage** — through futures, swaps, and FX forwards — so gross exposure routinely exceeds NAV. Two exposure numbers matter:

- **Gross exposure** = sum of the *absolute* sizes of all positions. Measures how much market you are touching.
- **Net exposure** = sum of *signed* positions. Measures your directional tilt.

A book can be 300% gross and 0% net (heavily engaged, market-neutral) or 100% gross and 100% net (one big directional bet). They are very different risk profiles at the same NAV.

Finally, the unit that makes everything comparable: **basis points of NAV.** One bp = 0.01% of the fund. On a CAD 100m fund, 1 bp = CAD 10,000. Every P&L, every expected payoff, every risk limit in this course is quoted in bp of NAV so that a rates trade and an FX trade can sit in the same risk budget and be compared directly.

`P&L in bp of NAV = (P&L in CAD) / NAV × 10,000`

> [!EXERCISE]
> A CAD 100m fund holds a position that makes CAD 250,000. Express the gain in bp of NAV. *(Answer: 250,000 / 100,000,000 × 10,000 = 25 bp.)* Now express a 6% annual volatility target as a daily figure in bp, using √252 ≈ 15.9 trading days per √year. *(≈ 6% / 15.9 ≈ 0.38% ≈ 38 bp per day.)*

---

## 5. Combining positions: the two-asset case

Portfolio volatility is **not** the weighted average of position volatilities — correlation changes everything. For two positions:

`σ_p² = w₁²σ₁² + w₂²σ₂² + 2·w₁·w₂·σ₁·σ₂·ρ`

The cross term carries the diversification. With `ρ = +1` volatilities add; with `ρ = −1` they can cancel entirely; anywhere in between you get a portfolio less volatile than the sum of its parts. Open the **Portfolio volatility** tab in the **Calculators & Scenarios** workbench and confirm the extremes: two 10% assets at equal weight give 10% volatility at `ρ = +1`, but 0% at `ρ = −1`.

> [!CONCEPT]
> This is why "ten trades" can be "one bet." If all ten load the same latent factor — say, benign-growth risk-on — their pairwise correlations are near +1 and the cross terms compound rather than cancel. You have concentration wearing the costume of diversification. Week 14 formalizes this; this week, just distrust position *count* as a measure of diversification.

---

## 6. The risk budget and the shadow fund

You now have enough to run a fund responsibly. The shadow fund's starting framework (from **Portfolio & Risk**) is deliberately conservative and *educational*, not a claim about real mandates:

- NAV: **CAD 100m**
- Target annualized volatility: **6%**
- Soft maximum drawdown: **6%**; hard review threshold: **8%**
- Max risk contribution from one thesis: **20%**
- Max correlated-theme risk: **40%**
- At least **5 independent theses** when fully invested

These constraints exist so that no single trade — however high your conviction — can end the fund, and so that your track record measures *process*, not a single lucky bet.

> [!WARNING]
> Do not wait until you "know enough" to start the portfolio. A track record built from Week 2 — including the early clumsy trades — is worth far more than a pristine one started in Week 20. The mistakes are the curriculum. Start now.

---

## This week's work

> [!DELIVERABLE]
> **Shadow Fund Investment Policy Statement (IPS).** One page: mandate and objective; base currency (CAD) and starting NAV (100m); the volatility target and drawdown thresholds above; position-level and correlated-theme risk limits; your minimum number of independent theses; and your rules for when a thesis is invalidated vs. merely stopped out. This document governs every position you enter for the rest of the course.

**Lab (do it in the app):**

1. Use the **return-stats** widget above to build intuition for the volatility tax and Sharpe.
2. Open the **Shadow Portfolio**. Confirm the ledger starts at CAD 100m NAV.
3. Take the Week 1 memo you wrote and, if it still holds, **size it against your new risk budget** (use the **Position sizing** calculator — loss budget as a fraction of NAV, divided by the adverse move) and enter it as your **first paper trade**. Save a memo first; the position freezes a snapshot of it.
4. Enter a **second, genuinely independent** paper trade (low correlation to the first) so the book is diversified from day one.
5. Record today's NAV snapshot so drawdown tracking has a starting peak.

**Gate — do not advance below this bar:**

- You can explain, with a worked example, why the geometric mean is below the arithmetic mean and why volatility taxes compounding.
- You can express any P&L and any risk limit in bp of NAV.
- Your shadow fund exists, has an IPS, and holds two paper trades that are not the same bet.
- Take the five-question **Weekly Self-Test** for Week 2 (Assessments) and score at least 7/10.

> [!CONCEPT]
> **The one thing to carry forward:** risk — measured as volatility, correlation, drawdown, and bp of NAV — is the common currency that lets you compare a bond, an FX forward, and an equity position inside one budget. From here on, every thesis is sized in that currency, and the shadow fund keeps the score.
