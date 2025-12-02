import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3001",
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
      "src/**/*.cy.{js,jsx,ts,tsx}",
    ],
    supportFile: false,
  },
});
