import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('first-visit onboarding saves the selected federal state', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /which bundesland are you preparing for/i })).toBeVisible();
  await page.getByLabel('Federal state (Bundesland)').selectOption('by');
  await expect(page.getByRole('heading', { name: /lid test trainer/i })).toBeVisible();
  await expect(page.getByText(/bayern/i).first()).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('lid-trainer-bundesland'))).toBe('by');
});

test('state banks with text image placeholders can start a mock exam', async ({ page }) => {
  await page.getByLabel('Federal state (Bundesland)').selectOption('he');
  const startMock = page.getByRole('button', { name: /start mock test/i });
  await expect(startMock).toBeEnabled();
  await startMock.click();
  await expect(page.getByRole('heading', { name: new RegExp('mock exam · 1/33', 'i') })).toBeVisible();
});

test('mock exam supports navigation, changing answers and submission', async ({ page }) => {
  await page.getByLabel('Federal state (Bundesland)').selectOption('by');
  await page.getByRole('button', { name: /start mock test/i }).click();
  await expect(page.getByRole('heading', { name: /mock exam · 1\/33/i })).toBeVisible();

  await page.getByRole('button', { name: 'Go to question 2', exact: true }).click();
  await expect(page.getByRole('heading', { name: /mock exam · 2\/33/i })).toBeVisible();
  const firstAnswer = page.locator('.answer-options .answer-option').first();
  await firstAnswer.click();
  await expect(firstAnswer).toHaveClass(/chosen/);

  await page.getByRole('button', { name: 'Go to question 1', exact: true }).click();
  await expect(page.getByRole('heading', { name: /mock exam · 1\/33/i })).toBeVisible();
  await page.getByRole('button', { name: 'Go to question 33', exact: true }).click();
  await page.getByRole('button', { name: 'Hand in' }).click();
  await expect(page.getByText(/session complete/i)).toBeVisible();
  await expect(page.getByText(/\/33/).first()).toBeVisible();
});

test('progress transfer code is shown and invalid imports are rejected', async ({ page }) => {
  await page.getByLabel('Federal state (Bundesland)').selectOption('by');
  const transfer = page.getByRole('heading', { name: /move progress to another device/i });
  await expect(transfer).toBeVisible();
  const code = page.locator('textarea[readonly]');
  await expect(code).toHaveValue(/^LID2-/);
  await page.getByPlaceholder('Paste LID1- code').fill('not-a-valid-code');
  await page.getByRole('button', { name: 'Import' }).click();
  await expect(page.getByRole('status')).toContainText(/invalid/i);
});


test('Berlin selection uses Berlin state questions, not Bayern labels or questions', async ({ page }) => {
  await page.getByLabel('Federal state (Bundesland)').selectOption('be');
  await expect(page.getByText('LEBEN IN DEUTSCHLAND · BERLIN')).toBeVisible();
  const jump = page.getByLabel('Jump to question');
  await expect(jump.locator('option').last()).toHaveText('Berlin 10');
  await jump.selectOption({ label: 'Berlin 1' });
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  await expect(page.getByText('Welches Wappen gehört zum Bundesland Berlin?')).toBeVisible();
  await expect(page.locator('.question-meta span').nth(1)).toHaveText('Berlin 1');
  await expect(page.getByText(/Bayern B[1-9]|Bayern 10/)).toHaveCount(0);
});

test('Hamburg question labels follow the selected Bundesland', async ({ page }) => {
  await page.getByLabel('Federal state (Bundesland)').selectOption('hh');
  const jump = page.getByLabel('Jump to question');
  await expect(jump.locator('option').last()).toHaveText('Hamburg 10');
  await jump.selectOption({ label: 'Hamburg 1' });
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  await expect(page.getByText('Welches Wappen gehört zur Freien und Hansestadt Hamburg?')).toBeVisible();
  await expect(page.locator('.question-meta span').nth(1)).toHaveText('Hamburg 1');
});

test('state topic section follows the selected Bundesland and shows its ten questions', async ({ page }) => {
  for (const state of [{ code: 'be', name: 'Berlin', fact: 'Pankow' }, { code: 'hh', name: 'Hamburg', fact: 'Altona' }]) {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByLabel('Federal state (Bundesland)').selectOption(state.code);
    const row = page.locator('.topic-row').filter({ has: page.locator('strong', { hasText: state.name }) });
    await expect(row).toContainText(state.name);
    await expect(row).toContainText('3 of these 10 come up');
    await expect(row).toContainText('10 questions');
    await row.click();
    await expect(page.getByRole('heading', { name: state.name, exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Key facts' })).toBeVisible();
    await expect(page.locator('.facts-list')).toContainText(state.fact);
    await expect(page.locator('.facts-list')).not.toContainText('Welches ist ein Bezirk');
    await expect(page.locator('.facts-list')).not.toContainText('Für wie viele Jahre');
    await expect(page.getByRole('button', { name: 'All in order' })).toBeVisible();
    await page.getByRole('button', { name: 'All in order' }).click();
    await expect(page.getByText(state.name + ' 1')).toBeVisible();
  }
});
