import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://localhost:3001',
    ignoreHTTPSErrors: true,
    video: 'on', // Video für jeden Testdurchlauf
    screenshot: 'only-on-failure', // Screenshot nur bei Fehlern
  },
});
