import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('Should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the login form with invalid bitsindri email
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.fill('input[placeholder="Registration Number"]', '2023NG00');
    await page.fill('input[placeholder="Email (must end with @bitsindri.ac.in)"]', 'invalid@gmail.com');
    await page.fill('input[placeholder="Password"]', 'password123');
    
    // Submit
    await page.click('button:has-text("Log In")');
    
    // Assert error message
    await expect(page.locator('text=Email must end with @bitsindri.ac.in')).toBeVisible();
  });

  test('Should display loading state on submission', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the login form with valid data
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.fill('input[placeholder="Registration Number"]', '2023NG00');
    await page.fill('input[placeholder="Email (must end with @bitsindri.ac.in)"]', 'valid@bitsindri.ac.in');
    await page.fill('input[placeholder="Password"]', 'password123');
    
    // Submit
    await page.click('button:has-text("Log In")');
    
    // Check loading state
    await expect(page.getByText('Logging in...')).toBeVisible();
  });
});
