import { test, expect } from '../fixtures/my-fixtures';

test('Login', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('admin', 'p');
});
