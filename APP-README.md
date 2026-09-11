# Macro Practice

A static Astro course built around the original Markdown curriculum. No account, backend, live price feed, or API key is needed.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Astro (normally http://127.0.0.1:4321).

```sh
npm run build
npm run preview
npm test
```

The production build is static output in `dist/`. Fonts and icons are bundled locally. After installing dependencies, the course needs no network connection.

## Content and state

- The root `01-*.md` through `11-*.md` files and `README.md` remain canonical and human-editable. Astro's content collection loads numbered Markdown/MDX files directly from this directory.
- Application code lives in `src/`. `codex-build-spec.md` remains the implementation brief, not a lesson.
- Personal data lives in browser localStorage under `macro-practice-v1`. Backups use a validated version-1 JSON schema. Use Data & Settings to export, import or reset. Journal-only backups merge by ID; complete backups replace the workspace after confirmation.
- Use the same browser and local origin consistently: `localhost` and `127.0.0.1`, or different ports, have separate storage. Export/import to transfer records.
- Invalid stored data is retained for recovery and automatic writes are blocked. Export preserves the original stored data. Concurrent changes in another tab block saving until a reload.

## Learning workflow

Set your current week in Data & Settings. Each curriculum heading has independent progress. Dashboard completion counts all numbered curriculum headings; roadmap tiles reflect the corresponding week heading. Weekly self-tests use the five open-response questions and 0/1/2 rubric in `09-assessments.md`; reveal opens the scoring guide and weekly reference, not an invented model answer. Interview prompts come from the same source.

Trade memo field names and guidance are parsed from `05-investment-process.md`. Save a memo before adding a ledger position. Opening decisions, timestamps and a full memo snapshot are frozen within the position. Mark, review date and notes remain editable until closure. Closing a memo also closes linked open positions at their recorded marks. Closed positions are read-only. Local records are not a tamper-proof institutional audit system; backup files remain user-controlled.

Case-study scenarios are visible; discussion prompts and later sections stay collapsed until a dated view is committed. The supplied cases contain prompts rather than historical answer keys. The source Markdown remains accessible for ordinary study.

## Calculation conventions

- Bond calculator: fixed coupon, coupon-date settlement, flat nominal YTM compounded at coupon frequency. Shows cash flows, price, Macaulay/modified duration, analytical/numerical DV01, convexity and approximate shocked P&L.
- Position sizing: loss budget divided by an assumed adverse linear price return.
- Portfolio volatility: two user-specified assets with signed weights, annualized volatility and correlation; remaining cash has zero volatility.
- FX: domestic-per-foreign quote, simple-interest covered interest parity, with carry assumptions displayed.
- Scenario lab: signed CAD sensitivities times shocks in bp or percentage points; no nonlinear or liquidity modelling.
- Ledger: starts at CAD 100 million. P&L is signed entry notional times `(current price / entry price - 1)`. All prices are manual. Excludes financing, FX conversion, contract multipliers and cash flows. Futures, options and swaps need instrument-aware valuation before real-world use.
- Exposure uses entry notional, split into gross and signed net by asset class, country or theme. Carry is recorded separately and is not silently added to marked P&L. Win rate uses closed positions, including zero-P&L trades in the denominator.
- NAV snapshots record today's marked NAV. Drawdown is calculated from chronological snapshots, including initial NAV as a starting peak. Missing dates are not interpolated. Replace a same-day snapshot only after confirmation.

## Markdown extensions

Optional frontmatter: `title`, `week` (1-24), `phase`, `estimated_hours`, and `prerequisites` (string array).

```md
> [!CONCEPT]
> A concept with supporting explanation.
```

Also supports `PM QUESTION`, `EXERCISE`, `DELIVERABLE`, and `WARNING` callouts. Heading identifiers are generated from titles, so renaming a heading creates a new progress key. Keep headings stable to preserve progress associations.

## Browser verification

With the dev server running at port 4321:

```sh
npm run test:e2e
```

Tests use the installed Microsoft Edge browser. Change `channel` in `playwright.config.ts` or install Playwright Chromium on other platforms. Test data stays in isolated browser profiles. Screenshots and traces are saved under `test-results/`.
