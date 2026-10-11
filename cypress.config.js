import { defineConfig } from 'cypress';
import path from 'node:path';

export default defineConfig({
  video: true,
  videoCompression: false,
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
        if (config.env.EXTENSION_DIR !== 'none') launchOptions.extensions.push(path.resolve(config.env.EXTENSION_DIR || 'dist-test'));
        if (browser.name === 'electron') {
          // Küçük pencere = daha az video kodlama yükü.
          launchOptions.preferences.width = 1280;
          launchOptions.preferences.height = 720;
        }
        // Pencere arkada kalınca Chrome çizimi kısıyor ve video donuyordu.
        launchOptions.args.push(
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-background-timer-throttling',
        );
        return launchOptions;
      });
    },
  },
});
