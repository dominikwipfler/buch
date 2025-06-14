import { test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

export const test = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';