import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://localhost:3001',
    ignoreHTTPSErrors: true,
  },
});