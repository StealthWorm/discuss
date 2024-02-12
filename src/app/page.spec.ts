import { expect, test } from "playwright/test";

test('HomePage', async ({ page }) => {
  // Navigate to your frontend URL
  await page.goto('http://localhost:3000');

  // Check if the PostList component is rendered
  expect(page.getByText('Top Posts')).toBeDefined();
  expect(page.locator('PostList[data-test-id="posts"]')).toBeDefined();

  // Check if the TopicList component is rendered
  expect(page.getByText('Topics')).toBeDefined();
  expect(page.locator('TopicList[data-test-id="topics"]')).toBeDefined();
});

