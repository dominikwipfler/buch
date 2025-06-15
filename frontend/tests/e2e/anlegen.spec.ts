import { test, expect } from '@playwright/test';
import { BookPage } from '../page-objects/BookPage';

test('Buch anlegen', async ({ page }) => {
  await page.goto('https://localhost:3001/login');
  await page.getByLabel('Benutzername').fill('admin');
  await page.getByLabel('Passwort').fill('p');
  await page.getByRole('button', { name: /login/i }).click();

  const bookPage = new BookPage(page);
  await bookPage.createBook({
    isbn: '978-0-007-00644-1',
    titel: 'Titelpost',
    untertitel: 'untertitelpost',
    art: 'HARDCOVER',
    preis: '99.99',
    rabatt: '0.123',
    homepage: 'https://post.rest',
    beschriftung: 'Abb. 1',
    contentType: 'img/png',
  });
});