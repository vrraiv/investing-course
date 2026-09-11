import { test, expect } from '@playwright/test';

test('complete local learning, memo, ledger and backup workflow', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('#current-module')).toContainText('Forecast');
  await expect(page.locator('#next-deliverable')).toContainText('1-page');
  await expect(page.locator('.week-tile')).toHaveCount(24);
  await page.screenshot({ path: testInfo.outputPath('dashboard-desktop.png'), fullPage: true });
  await page.goto('/course/01-roadmap/');
  const lesson = page.getByRole('combobox', { name: /Progress: Week 1 / });
  await lesson.selectOption('complete');
  await page.reload(); await expect(lesson).toHaveValue('complete');

  await page.goto('/course/09-assessments/');
  await expect(page.locator('.question-block')).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    const q = page.locator('.question-block').nth(i);
    await q.locator('[data-answer=answer]').fill(`Reasoned answer ${i}`);
    await q.locator('input[value="2"]').check();
  }
  await page.locator('.question-block summary').first().click();
  await expect(page.locator('.question-block details').first()).toHaveAttribute('open', '');
  await expect(page.locator('#weekly-score')).toHaveText('10 / 10');
  await page.reload(); await expect(page.locator('#weekly-score')).toHaveText('10 / 10');
  await page.getByRole('button', { name: 'New question' }).click();
  await page.locator('#drill-form textarea').fill('A good macro trade differs from market pricing and has a catalyst.');
  await page.locator('#drill-form input[value="2"]').check();
  await page.getByRole('button', { name: 'Save response' }).click();
  await expect(page.locator('#drill-history details')).toHaveCount(1);

  await page.goto('/journal/');
  await page.getByLabel('Market observation').fill('Canadian inflation softened.');
  await page.getByLabel('Thesis update').fill('Reassess the easing path.');
  await page.getByLabel('Portfolio implication').fill('Watch front-end duration.');
  await page.getByRole('button', { name: 'Save entry' }).click();
  await expect(page.locator('#journal-list')).toContainText('Canadian inflation softened.');
  await page.getByRole('button', { name: 'Edit entry', exact: true }).click();
  await page.getByLabel('Market observation').fill('Canadian inflation softened again.');
  await page.getByRole('button', { name: 'Save entry' }).click();
  const journalDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export journal JSON' }).click();
  expect((await journalDownload).suggestedFilename()).toMatch(/investment-journal/);
  await page.reload(); await expect(page.locator('#journal-list')).toContainText('softened again');

  await page.goto('/memos/');
  await page.getByLabel('Trade title').fill('Canadian duration thesis');
  for (let i = 0; i < 13; i++) await page.locator(`[name="field-${i}"]`).fill(`Decision rationale ${i}`);
  await page.getByRole('button', { name: 'Save memo', exact: true }).click();
  await expect(page.locator('#memo-status')).toHaveText('OPEN');
  const memoDownload = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export saved memo as Markdown' }).click();
  expect((await memoDownload).suggestedFilename()).toMatch(/\.md$/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#memo-print-view')).toBeVisible(); await expect(page.locator('#memo-form')).toBeHidden();
  await page.pdf({ path: testInfo.outputPath('trade-memo.pdf'), format: 'A4' });
  await page.emulateMedia({ media: 'screen' });
  await page.getByRole('button', { name: 'Duplicate saved memo' }).click();
  await expect(page.locator('#memo-list .entry-row')).toHaveCount(2);

  await page.goto('/course/07-shadow-portfolio/');
  await page.getByRole('button', { name: 'Add position' }).click();
  await page.locator('#position-memo').selectOption({ index: 1 });
  await page.locator('#position-form [name=instrument]').fill('Canada 5-year bond');
  for (const [name, value] of Object.entries({ country: 'Canada', theme: 'Easing', notional: '1000000', entry_price: '100', current_price: '102', bull_pnl: '20', base_pnl: '10', bear_pnl: '-10' })) await page.locator(`#position-form [name=${name}]`).fill(value);
  await page.getByRole('button', { name: 'Save position', exact: true }).click();
  await expect(page.locator('#position-dialog')).not.toBeVisible();
  await expect(page.locator('#portfolio-unrealized')).toContainText('20,000.00');
  await page.getByRole('button', { name: 'Review position', exact: true }).click();
  await expect(page.locator('#position-form [name=entry_price]')).toBeDisabled();
  await page.locator('#position-form [name=current_price]').fill('103');
  await page.getByRole('button', { name: 'Save position', exact: true }).click();
  await expect(page.locator('#portfolio-nav')).toContainText('100,030,000.00');
  await page.getByRole('button', { name: "Record today's NAV" }).click();
  await expect(page.locator('#nav-chart svg')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('portfolio-desktop.png'), fullPage: true });
  await page.getByRole('button', { name: 'Review position', exact: true }).click();
  await page.locator('[name=close_position]').check();
  page.once('dialog', d => d.accept());
  await page.getByRole('button', { name: 'Save position', exact: true }).click();
  await expect(page.locator('#portfolio-realized')).toContainText('30,000.00');
  await page.reload(); await expect(page.locator('#portfolio-realized')).toContainText('30,000.00');

  await page.goto('/course/08-case-studies/');
  const caseForm = page.locator('.case-commit').first();
  await caseForm.locator('textarea').fill('Short nominal duration until pricing reflects persistent inflation.');
  await caseForm.getByRole('button', { name: 'Commit view' }).click();
  await expect(page.locator('.case-details').first()).toHaveAttribute('open', '');
  await page.reload(); await expect(page.locator('.case-commit textarea').first()).toHaveAttribute('readonly', '');

  await page.goto('/labs/'); await expect(page.locator('#bond-result')).toContainText('95.5482');
  await page.screenshot({ path: testInfo.outputPath('bond-workbench.png'), fullPage: true });
  await page.getByRole('tab', { name: 'Position sizing' }).click(); await expect(page.locator('#sizing-result')).toContainText('10,000,000');
  await page.getByRole('tab', { name: 'Portfolio volatility' }).click(); await expect(page.locator('#vol-result')).toContainText('9.2952');
  await page.getByRole('tab', { name: 'FX forward' }).click(); await expect(page.locator('#fx-result')).toContainText('1.337019');
  await page.getByRole('tab', { name: 'Scenario lab' }).click(); await expect(page.locator('#scenario-result')).toContainText('1,375,000');

  await page.goto('/settings/');
  const exportPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export all data' }).click();
  const backup = await exportPromise; const backupPath = testInfo.outputPath('backup.json'); await backup.saveAs(backupPath);
  const raw = await page.evaluate(() => localStorage.getItem('macro-practice-v1'));
  await page.locator('#import-all').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"version":999}') });
  await expect(page.locator('#toast')).toContainText('Invalid');
  expect(await page.evaluate(() => localStorage.getItem('macro-practice-v1'))).toBe(raw);
  page.once('dialog', d => d.accept()); await page.getByRole('button', { name: 'Reset course data' }).click();
  await expect(page.locator('#data-summary')).toContainText('0 journal entries');
  page.once('dialog', d => d.accept()); await page.locator('#import-all').setInputFiles(backupPath);
  await expect(page.locator('#data-summary')).toContainText('1 journal entries');
  await page.goto('/'); await expect(page.locator('#dash-score')).toContainText('10');
  expect(errors).toEqual([]);
});

test('all syllabus pages, responsive layouts, dark mode and local assets', async ({ page }, testInfo) => {
  const errors: string[] = []; const external: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4321') && !r.url().startsWith('data:')) external.push(r.url()); });
  await page.goto('/');
  const links = await page.locator('nav[aria-label="Course navigation"] a').evaluateAll(els => els.map(a => a.getAttribute('href')!));
  for (const link of links) { const response = await page.goto(link); expect(response?.status()).toBe(200); await expect(page.locator('main h1').first()).toBeVisible(); }
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/course/01-roadmap/', '/course/07-shadow-portfolio/', '/course/09-assessments/', '/memos/', '/journal/', '/labs/', '/settings/']) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      expect(overflow, `horizontal overflow at ${width}: ${route}`).toBe(false);
    }
    await page.goto('/');
    await page.screenshot({ path: testInfo.outputPath(`dashboard-${width}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.locator('#sidebar')).toHaveClass(/open/);
  await page.getByRole('link', { name: 'Rates', exact: true }).click();
  await expect(page).toHaveURL(/02-fixed-income-rates/);
  await page.getByRole('button', { name: 'Toggle color theme' }).click(); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: testInfo.outputPath('rates-dark-mobile.png'), fullPage: true });
  await page.goto('/labs/');
  await expect(page.locator('#bond-result .chart')).toBeVisible();
  const paths = await page.locator('#bond-result .chart polyline').getAttribute('points'); expect(paths!.split(' ').length).toBe(9);
  expect(errors).toEqual([]); expect(external).toEqual([]);
});
