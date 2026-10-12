import { defineConfig } from 'cypress';
import path from 'node:path';

export default defineConfig({
  // Not: video:false iken uzantının arka plan isteği Cypress altında hiç başlamıyor
  // (deneyle bulundu); bu yüzden açık. Demo videosu yine de cy.screenshot
  // karelerinden üretiliyor, çünkü yerleşik video LLM beklerken donuyor.
  video: true,
  viewportWidth: 1280,
  viewportHeight: 800,
  e2e: {
    baseUrl: 'http://localhost:5871',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
    includeShadowDom: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (config.env.EXTENSION_DIR !== 'none') {
          launchOptions.extensions.push(path.resolve(config.env.EXTENSION_DIR || 'dist-test'));
        }
        return launchOptions;
      });
    },
  },
});
