import { Page, expect } from '@playwright/test';

export class BookPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('https://localhost:3001');
  }

  async searchByTitle(title: string) {
    await this.page.getByLabel('Buchtitel').fill(title);
    await this.page.getByRole('button', { name: /suchen/i }).click();
  }

  async selectFirstResult() {
    await this.page.locator('li[role="listitem"]').first().click();
  }

  async expectDetailsVisible() {
    await this.page.getByText('Details').waitFor();
  }

  async createBook(book: {
    isbn: string;
    titel: string;
    untertitel?: string;
    art: string;
    preis: string;
    rabatt: string;
    homepage: string;
    beschriftung: string;
    contentType: string;
  }) {
    const isFormOpen = await this.page.getByLabel('ISBN').isVisible().catch(() => false);
    if (!isFormOpen) {
      await this.page.getByRole('button', { name: /neues buch anlegen/i }).click();
    }
    await this.page.getByLabel('ISBN').fill(book.isbn);
    await this.page.getByLabel('Buchtitel').fill(book.titel);
    if (book.untertitel) {
      await this.page.getByLabel('Buchuntertitel').fill(book.untertitel);
    }
    // Dropdown für Art:
    await this.page.getByLabel('Art').click();
    await this.page.getByRole('option', { name: book.art }).click();
    await this.page.getByLabel('Preis').fill(book.preis);
    await this.page.getByLabel('Rabatt').fill(book.rabatt);
    await this.page.getByLabel('Homepage').fill(book.homepage);
    await this.page.getByLabel('Abbildung Beschriftung').fill(book.beschriftung);
    await this.page.getByLabel('Abbildung Content-Type').fill(book.contentType);
    await this.page.getByRole('button', { name: /buch anlegen/i }).click();
  }
}
