import { test, expect } from '@playwright/test';

test('Buch suchen', async ({ page }) => {
  await page.goto('https://localhost:3001/login');
  await page.getByLabel('Benutzername').fill('admin');
  await page.getByLabel('Passwort').fill('p');
  await page.getByRole('button', { name: /login/i }).click();

  await page.getByLabel('Buchtitel').fill('Alpha');
  await page.getByRole('button', { name: /suchen/i }).click();
});