import { BASE_URL } from '@_config/env.config'; // <-- jeśli nie używamy zmiennych środowiskowych zakomentować
import { defineConfig } from '@playwright/test'; // <-- moduł konfiguracyjny frame'a

export default defineConfig({
  testDir: './tests', // <-- Ścieżka do testów pobieranych do egzekucji
  fullyParallel: true, // <-- globalnie testy mają być wykonywane równolegle
  workers: undefined, // <-- tyle osobnych workerów ile wytrzyma komp
  reporter: 'html', // <-- podstawowy wygląd raportu z playwrighta
  use: {
    baseURL: BASE_URL, // <-- jeśli "NIE" używamy zmiennych środowiskowych zakomentować
    // baseURL: 'https://api.trello.com/', //<-- jeśli "NIE" używamy zmiennych środowiskowych odkomentować
  },
});
