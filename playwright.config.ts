import { BASE_URL } from '@_config/env.config'; // <-- jeśli nie używamy zmiennych środowiskowych zakomentować
import { defineConfig } from '@playwright/test'; // <-- moduł konfiguracyjny frame'a

export default defineConfig({
  testDir: './tests', // <-- Global settings for Path to tests taken to execution
  fullyParallel: true, // <-- Global settings for tests performed in parallel
  workers: undefined, // <-- Global settings for parallel tests to use as many workers as device can handle
  reporter: 'html', // <-- Global settings for basic report display only
  use: {
    baseURL: BASE_URL, // <-- If we use env variables comment this line
    // baseURL: 'https://api.trello.com/', //<-- if we DO NOT use env variables - uncomment this line
    // instead of the above one
  },
});
