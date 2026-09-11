# Codex Build Spec: Interactive Local Course

Use this file as the implementation brief for Codex.

## Goal

Turn the Markdown curriculum in this directory into a polished local learning application. The source Markdown should remain human-editable and be the canonical curriculum content.

## Preferred Stack

Use a lightweight static/local stack:
- Astro;
- TypeScript;
- Markdown/MDX content collections;
- minimal client-side JavaScript;
- localStorage for progress and answers;
- no authentication;
- no external database;
- no paid APIs.

The site must work with `npm run dev` and build statically with `npm run build`.

## Information Architecture

Sidebar:
- Dashboard
- 24-Week Roadmap
- Rates
- FX & Cross-Asset
- Portfolio & Risk
- Investment Process
- Quant Labs
- Shadow Portfolio
- Case Studies
- Assessments
- Resources
- Capstone

## Dashboard

Show:
- week number;
- phase;
- percent complete;
- current module;
- next deliverable;
- shadow-fund status;
- recent journal entries;
- assessment scores.

## Interactive Features

### Progress
Every heading or lesson can be marked:
- Not started
- In progress
- Complete

Persist locally.

### Self-tests
Parse specially formatted question blocks or create a simple question schema.

Support:
- reveal answer;
- self-score 0/1/2;
- notes;
- aggregate weekly score.

### Investment Journal
Local form:
- date;
- market observation;
- thesis update;
- portfolio implication;
- confidence;
- follow-up date.

Export/import JSON.

### Trade Memo
Implement the template from `05-investment-process.md` as a form.

Features:
- save locally;
- edit;
- duplicate;
- close trade;
- export Markdown;
- print-friendly view.

### Shadow Portfolio
Implement ledger from `07-shadow-portfolio.md`.

Calculate where data are entered:
- realized/unrealized P&L;
- NAV;
- return;
- exposure by asset class/country/theme;
- win rate;
- drawdown if daily/monthly NAV history is available.

Do not fake live prices. Prices are manually entered unless a free data adapter is added later.

### Calculators
Create educational calculators for:
- bond price;
- duration;
- DV01;
- convexity;
- approximate bond P&L;
- position sizing;
- portfolio volatility from user inputs;
- FX forward/carry intuition.

Show formulas and intermediate calculations.

### Scenario Lab
Allow user-defined shocks:
- yield bp;
- FX %;
- equity %;
- commodity %.

Apply simple linear sensitivities supplied by the user and clearly label the output as an approximation.

### Case Study Mode
For case-study Markdown, support collapsible sections so that future information/answers can be hidden until the user commits to a view.

### PM Drill
Randomly select interview questions from `09-assessments.md`.
Provide:
- optional countdown timer;
- textbox;
- self-score;
- saved history.

## Markdown Extensions

Support optional frontmatter:

```yaml
---
title: Bond Mathematics
week: 3
phase: 1
estimated_hours: 6
prerequisites: [week-1, week-2]
---
```

Support custom callouts:
- `> [!CONCEPT]`
- `> [!PM QUESTION]`
- `> [!EXERCISE]`
- `> [!DELIVERABLE]`
- `> [!WARNING]`

## UX

Professional research-terminal feel without imitating Bloomberg.
Prioritize:
- dense but readable information;
- keyboard navigation;
- responsive layout;
- strong typography;
- print-friendly memos;
- dark/light mode;
- no decorative animations.

## Data Model

Keep application state versioned in localStorage and provide:
- Export all data to JSON
- Import JSON
- Reset course data with confirmation

This prevents the course from becoming dependent on a hosted backend.

## Important Architecture Rule

Separate:
1. curriculum content (`.md`);
2. application code;
3. user-generated course state.

Do not hard-code curriculum prose into React/Astro components.

## First Implementation Pass

1. Scaffold Astro project.
2. Ingest all Markdown.
3. Build navigation and dashboard.
4. Add progress tracking.
5. Add self-tests.
6. Add trade memo + journal.
7. Add portfolio ledger.
8. Add calculators.
9. Add import/export.
10. Polish print and mobile views.

## Acceptance Test

A user should be able to clone the folder, run:

```bash
npm install
npm run dev
```

and then:
- navigate the entire syllabus;
- mark lessons complete;
- answer/self-score questions;
- create a trade memo;
- maintain a shadow portfolio;
- use the core calculators;
- export all personal data;
- reload the browser without losing progress.
