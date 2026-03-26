import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { users } from './utils/testData/users';

dotenv.config();

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,

  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'], 
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: true,

    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: users.flatMap((user) =>
    browsers.map((browser) => ({
      name: `${user.username}-${browser.name}`,

      use: {
        ...browser.device,
        browserName: browser.name as 'chromium' | 'firefox' | 'webkit',
      },

      metadata: {
        user,
      },
    }))
  ),
});