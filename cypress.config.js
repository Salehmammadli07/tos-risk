import { defineConfig } from 'cypress';
import path from 'node:path';

export default defineConfig({
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
        launchOptions.extensions.push(path.resolve(config.env.EXTENSION_DIR || 'dist-test'));
        return launchOptions;
      });
    },
  },
});
