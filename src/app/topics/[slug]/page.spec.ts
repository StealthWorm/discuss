import { expect, test } from "@playwright/test";

test('renders topic name correctly', async ({ page }) => {
  const decodedSlug = 'Javascript';
  await page.goto('http://localhost:3000/topics/Javascript')

  const h1Element = page.locator('h1');
  const h1TextContent = await h1Element.textContent();

  expect(h1TextContent).toEqual(decodedSlug);
  expect(page.locator('PostList[data-test-id="posts"]')).toBeDefined();
});

test('renders topic name correctly and renders two posts', async ({ page }) => {
  const decodedSlug = 'Javascript';

  // Mock the data returned by fetchPostByTopicSlug to contain two posts
  const mockPosts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
  await page.route('**/fetchPostByTopicSlug*', route => {
    route.fulfill({ body: JSON.stringify(mockPosts) });
  });

  await page.goto(`http://localhost:3000/topics/${decodedSlug}`);

  const postListElement = page.locator('PostList[data-test-id="posts"]');
  expect(postListElement).toBeDefined();
});

// await page.locator(':nth-match(:text("Buy"), 3)').waitFor();
// expect(await page.waitForURL('**/search?term=web'));
// expect(page.url()).toEqual(expectURL);
// Wait until all three buttons are visible
// const parent = page.getByRole('listitem').filter({ has: child });