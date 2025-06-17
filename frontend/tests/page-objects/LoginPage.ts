import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly _page: Page) {}

  get page() {
    return this._page;
  }

  async goto() {
    await this._page.goto('https://localhost:3001/login');
  }

  async login(username: string, password: string) {
    await this._page.getByLabel('Benutzername').fill(username);
    await this._page.getByLabel('Passwort').fill(password);
    await this._page.click('button:has-text("Login")');
  }
}
