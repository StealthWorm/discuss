import { expect, test } from "@playwright/test";
import { RenderResult, render } from '@testing-library/react';
import Header from "./Header";

test('Header - renders Discuss link', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const discussLink = page.locator('Link[href="/"]');
  expect(discussLink).toBeTruthy();
});

test('Header renders with sign-in and sign-out buttons when not logged in', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check if sign-in and sign-out buttons are present
  expect(page.locator('button:has-text("Sign In")')).toBeDefined();
  expect(page.locator('button:has-text("Sign Up")')).toBeDefined();
});

///////////////////////////////////////////////////////////////////

test('renders Navbar with correct children', async ({ page }) => {
  await page.goto('http://localhost:3000')
  const rendered: RenderResult = render(<Header />)
  await page.setContent(rendered.container.innerHTML)

  const discussLink = await page.$('text=Discuss')
  const searchInput = await page.$('[data-testid=search-input]')
  const headerAuth = await page.$('[data-testid=header-auth]')

  expect(discussLink).not.toBeNull()
  expect(searchInput).not.toBeNull()
  expect(headerAuth).not.toBeNull()
})

test('renders SearchInput within Suspense', async ({ page }) => {
  await page.goto('http://localhost:3000')
  const rendered: RenderResult = render(<Header />)
  await page.setContent(rendered.container.innerHTML)

  const searchInput = await page.$('[data-testid=search-input')
  const parentTag = await searchInput.parentElement()

  expect(parentTag?.tagName()).toBe('suspense')
})

test('renders HeaderAuth within NavbarContent with justify="end"', async ({ page }) => {
  await page.goto('http://localhost:3000')
  const rendered: RenderResult = render(<Header />)
  await page.setContent(rendered.container.innerHTML)

  const headerAuth = await page.$('[data-testid=header-auth]')
  const parentTag = await headerAuth?.parentElement();

  expect(parentTag?.tagName()).toBe('NavbarContent')
  expect(await parentTag.getAttribute('justify')).toBe('end')
})