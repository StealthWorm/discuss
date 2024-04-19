import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_audience: process.env.AUTH0_AUDIENCE,
    auth0_scope: process.env.AUTH0_SCOPE,
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_PASSWORD: process.env.GITHUB_PASSWORD,
    // auth0_auth_secret: process.env.AUTH_SECRET,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // tasks(on, config);
    },
    // baseUrl: 'http://localhost:3000',
    // não vai limpar o estado da tela após cada it
    testIsolation: false,
    supportFile: 'cypress/support/index.js',
  },
});
