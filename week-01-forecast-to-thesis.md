---
title: "Week 1 — From Forecast to Investment Thesis"
week: 1
phase: "I"
estimated_hours: 6
prerequisites: []
---

# Week 1 — From Forecast to Investment Thesis

**The central question of this course:** *why can a correct economic forecast still lose money?*

You already forecast the economy for a living. This week is about the translation an economist rarely has to make: turning a view of the world into a **position** that pays only if you are right *relative to what is already priced*, *within a horizon*, and *through a path you can survive*. Everything in the next 24 weeks — bond math, curves, FX, risk, sizing, attribution — is machinery bolted onto this one idea.

> [!CONCEPT]
> An economist is graded on whether the forecast matches the eventual data. An investor is graded on whether the *price* moves toward the forecast, by *when* they need it to, faster than the *cost of holding* the position erodes it. These are different exams. You can ace the first and fail the second.

## Learning objectives

By the end of this week you should be able to:

1. Explain the difference between an absolute forecast and a *relative-to-market* thesis.
2. Read a market price as an embedded forecast and distribution.
3. Compute an expected value from a scenario distribution and explain why it differs from the single most likely outcome.
4. Turn a central-bank call into a probability distribution and locate your **variant perception** against market pricing.
5. State a thesis as *view + variant perception + catalyst + horizon + invalidation*.
6. Name at least three ways to lose money after correctly forecasting the terminal policy rate.

---

## 1. Prices are forecasts

A market price is not a fact about today; it is a **weighted average of the future** that thousands of participants have already bet on. When the 2-year yield is 3.10%, the market is not telling you where policy is — it is telling you the average path of overnight rates it expects over two years, plus a premium for bearing the risk.

This has a hard consequence:

> [!WARNING]
> You are not paid for being right about the economy. You are paid for being right about the economy **in a way the market has not already agreed with.** If your forecast equals the consensus embedded in the price, the correct forecast is worth exactly zero to a portfolio.

So the first move of every trade is subtraction:

`edge = your view − the view already in the price`

An economist stops at "the Bank of Canada will cut twice this year." An investor asks: *how many cuts are already priced? If the strip prices two cuts and I expect two cuts, I have no trade — no matter how right I am.*

### Absolute vs. relative

- **Absolute forecast:** "Inflation falls to 2% by Q3." A statement about the world.
- **Relative thesis:** "The market prices inflation sticky above 2.5% through Q3; I think it prints 2% and the front end is therefore too cheap." A statement about the *disagreement* between you and the price.

Only the second is tradable. The rest of this lesson is about making that second statement precise enough to size.

---

## 2. Think in distributions, not points

Economists report a modal forecast — the single most likely number. Markets pay off over the **whole distribution**. The quantity that matters for a position is the *expected value*: every outcome weighted by its probability and its payoff.

`EV = Σ (probabilityᵢ × payoffᵢ)`

Consider a trade with three scenarios, sized in **basis points of NAV** (1 bp = 0.01% of the fund — we formalize this next week):

| Scenario | Probability | P&L (bp of NAV) |
|---|---:|---:|
| Bull | 25% | +120 |
| Base | 50% | +15 |
| Bear | 25% | −140 |

The **modal** (most likely) outcome is the base case: +15 bp. But the expected value is:

`EV = 0.25×120 + 0.50×15 + 0.25×(−140) = 30 + 7.5 − 35 = +2.5 bp`

The single most likely outcome looks fine; the *trade* is barely positive because the bear tail is fat. A position sized off the modal case alone would be far too large. Change the numbers below and watch how the expected value and the modal outcome pull apart — this gap is where careless macro traders lose money.

<div class="lesson-widget" data-widget="expected-value"></div>

> [!PM QUESTION]
> "Your base case is the most likely outcome, so why isn't the trade sized to it?" — Answer in terms of the tails: sizing responds to the *distribution* of P&L, not to the mode. A high-probability small gain paired with a low-probability large loss can have a negative expected value and a punishing drawdown.

---

## 3. From your view to a policy-rate distribution

Now make it concrete with the instrument you know best: the central-bank policy rate. Pick a **Bank of Canada decision roughly six months out**. Instead of a point forecast, assign probabilities across the plausible outcomes, then compare your *expected* change to the change the market has priced (read it from OIS / the overnight-index strip — Week 6 makes this exact; a rough number is fine now).

The tool below starts with an illustrative distribution and a market-implied number. Edit the probabilities and outcomes to match your own view, then read the **variant perception** at the bottom: the distance between your mean and the market's.

<div class="lesson-widget" data-widget="policy-distribution"></div>

> [!CONCEPT]
> **Variant perception** is not "I'm more dovish." It is a *measured* gap: "the strip prices −18 bp into this meeting; my distribution averages −31 bp; my disagreement is 13 bp, and it is about the *number* of cuts, not their *timing*." A number you can size is worth ten adjectives.

Notice the widget also tells you where you disagree structurally. Disagreement can live in four different places, and each implies a different expression (Weeks 5–8):

- **Number** of cuts/hikes,
- **Timing** of the moves,
- **Terminal** rate the cycle settles at,
- **Distribution / tail** — the market underprices a big move in one direction.

> [!EXERCISE]
> Using the widget, build your own six-month BoC distribution. Then answer: (1) What is your expected change vs. the market's? (2) Is the disagreement about number, timing, terminal, or tails? (3) What single data release or event would most move your distribution toward the market's — or the market's toward yours? Log the answers as your first **journal** entry (Investment Journal in the sidebar).

---

## 4. Anatomy of a thesis

A thesis is not a forecast with conviction. It is a small, testable structure. Every trade memo you write this course fills in these fields (the template lives in **Investment Process**; the memo workspace is under **Trade Memos**):

1. **View** — what you expect (a distribution, not a point).
2. **What's priced** — the market's embedded view, measured.
3. **Variant perception** — the specific, quantified disagreement.
4. **Catalyst** — *why should the price converge to your view within your horizon?* A view with no catalyst is a prayer with a P&L attached.
5. **Horizon** — how long you will hold, and therefore how much carry you must pay.
6. **Invalidation** — the *observable fact* (not a price stop) that would prove you wrong.

> [!WARNING]
> The most common failure of ex-economists is a thesis with a view and no catalyst. "Rates should be lower" is true for years while you bleed carry. The market can stay disagreed with you longer than your risk budget can stay solvent. Demand a catalyst inside your horizon.

---

## 5. Three ways to be right and still lose

This is the week's gate. Suppose you correctly forecast the **terminal policy rate** — the level where the cycle settles. You can still lose money in at least three distinct ways:

1. **It was already priced.** The market agreed with your terminal rate before you put the trade on. There was never any convergence left to capture; you paid the spread and earned nothing.
2. **Path and timing.** You are right about the destination but wrong about the route. Rates spike *before* they fall; a stop or a margin call takes you out at the worst point, or the horizon expires before convergence. *Right eventually, wrong first.*
3. **Carry and roll bleed.** Holding the position costs more in carry/roll than the convergence pays. A steep curve can make you pay to be right slowly. (You quantify carry and roll in Week 7; this week just internalize that *time is not free*.)

Two more worth knowing: **wrong expression** (right on rates, but you chose an instrument that also loaded up on an unrelated risk that moved against you) and **correlation** (the trade was right, but it was the same bet as three others you already held, so it added risk without adding edge).

> [!PM QUESTION]
> "Explain three ways to lose money despite correctly forecasting the terminal policy rate." Be able to say this in under 60 seconds, with a concrete example of each. This is the Week 1 gate and a standing interview question.

---

## 6. Choosing an expression (preview)

Once you have a measured disagreement, you choose the instrument that most *purely* isolates it. You will build this vocabulary over the next two phases; for now, notice the ladder of precision:

- **Outright:** "Canada 2-year yields will fall." Clean, but loaded with global duration and term-premium risk.
- **Curve:** "Canada 2s10s will steepen." Isolates the *shape* of your view, hedges the level.
- **Cross-market:** "Canadian front-end outperforms U.S. front-end." Isolates your genuine informational edge — the relative policy call — and hedges the global factor you have no edge on.

The more precisely the expression matches your variant perception, the more of your P&L comes from being right about *the thing you actually know*, and the less comes from noise.

---

## This week's work

> [!DELIVERABLE]
> **One-page "forecast → price → trade" memo.** Pick one live macro view. In a single page: state your view as a distribution; state what the market prices; quantify the variant perception; name the catalyst and horizon; name the invalidation. Draft it in the **Trade Memos** workspace and export it to Markdown. This is the seed of your investment casebook.

**Lab (do it in the app):**

1. Open the **policy-distribution** widget above and build a real six-month BoC (or Fed) distribution.
2. Record the market-implied number, your mean, and the variant perception in the **Investment Journal**.
3. Write the one-page memo in **Trade Memos**. *Do not enter a position yet* — Week 2 launches the shadow fund and gives you a NAV and risk limits to size against.

**Gate — do not advance below this bar:**

- You can explain three ways to lose money despite a correct terminal-rate forecast.
- You can state a thesis as view + what's-priced + variant perception + catalyst + horizon + invalidation.
- Take the five-question **Weekly Self-Test** for Week 1 (Assessments) and score at least 7/10 before moving on.

> [!CONCEPT]
> **The one thing to carry forward:** a forecast becomes an investment only after you subtract what is priced, attach a catalyst inside a horizon, and define what would prove you wrong. Next week you get the measuring instruments — returns, volatility, and risk — and you launch the shadow fund that will hold every trade you build.
