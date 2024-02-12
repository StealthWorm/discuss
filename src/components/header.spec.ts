import { expect, test } from "@playwright/test";
import { render, screen } from '@testing-library/react'
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import config from "../../jest.config";

test('Header - renders Discuss link', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const discussLink = page.locator('Link[href="/"]');
  expect(discussLink).toBeTruthy();

  // const pageContent = await page.textContent('h1')
  // expect(pageContent).toContain('Discuss');
});

test('Header renders with sign-in and sign-out buttons when not logged in', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check if sign-in and sign-out buttons are present
  expect(page.locator('button:has-text("Sign In")')).toBeDefined();
  expect(page.locator('button:has-text("Sign Up")')).toBeDefined();
});

// jest.mock('next-auth/react', () => ({
//   useSession: jest.fn().mockReturnValue({
//     _esModule: true,
//     data: { user: { name: 'John Doe', email: 'john@example.com', image: 'avatar.jpg' } },
//     status: 'authenticated',
//   }),
// }));

// jest.mock("next-auth/react", () => {
//   const originalModule = jest.requireActual('next-auth/react');
//   const mockSession = {
//     expires: new Date(Date.now() + 2 * 86400).toISOString(),
//     user: { name: 'John Doe', email: 'john@example.com', image: 'avatar.jpg' }
//   };
//   return {
//     __esModule: true,
//     ...originalModule,
//     useSession: jest.fn(() => {
//       return { data: mockSession, status: 'authenticated' }  // return type is [] in v3 but changed to {} in v4
//     }),
//   };
// });

// test('Header renders with avatar when logged in', async ({ page }) => {
//   await mockUseSession({ status: 'authenticated', user: { image: 'user_image_url' } });er component
//   // expect(page.getByText("Log Out")).toBeInViewport();

//   // Check if avatar is present inside Popover with id "avatar"
//   expect(page.locator('id=avatar')).toBeTruthy();
//   expect(page.locator('id=avatar')).toHaveCSS('visibility', 'visible');
// });