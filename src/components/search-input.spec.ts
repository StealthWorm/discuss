import { expect, test } from "@playwright/test";

test('Search Input Component', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const input = page.locator('Input[name="term"]');
  expect(input).toBeDefined();
});

test('Search Input Filled', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const input = page.locator('Input[name="term"]');
  expect(input).toBeDefined();

  await input.fill('web');
  await page.keyboard.press('Enter');

  const expectURL = 'http://localhost:3000/search?term=web'
  expect(await input.getAttribute('value')).toEqual('web');
  expect(await page.waitForURL('**/search?term=web'));
  expect(page.url()).toEqual(expectURL);
});
