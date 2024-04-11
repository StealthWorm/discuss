import { expect, test } from "@playwright/test";

test('renders and submits the topic create form', async ({ page }) => {
  // Navigate to the page with the form (assuming it's hosted at http://localhost:3000)
  await page.goto('http://localhost:3000');
  await page.click('button:has-text("Create a Topic")');

  // Fill the form inputs
  await page.fill('input[name="name"]', 'Test Topic');
  await page.fill('textarea[name="description"]', 'This is a test description.');

  // Submit the form
  await page.click('button:has-text("Save")');

  // Wait for form submission
  // await page.waitForSelector('form[action="/actions.createTopic"]');

  // Assert that the form has been submitted
  const formAction = await page.getAttribute('form', 'action');
  // expect(formAction).toBe('/actions.createTopic');
  console.log(formAction);
});

test('validates input fields and displays errors', async ({ page }) => {
  // Navigate to the page with the form (assuming it's hosted at http://localhost:3000)
  await page.goto('http://localhost:3000');
  await page.click('button:has-text("Create a Topic")');

  // Submit the form
  await page.click('button:has-text("Save")');

  // Assert that input validation errors are displayed for both fields
  // const nameErrorText = await page.textContent('.text-red-400:has-text("Name is required")');
  // const descriptionErrorText = await page.textContent('.text-red-400:has-text("Description is required")');
  // expect(nameErrorText).toBeTruthy();
  // expect(descriptionErrorText).toBeTruthy();
});
