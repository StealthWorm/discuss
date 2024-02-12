import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-playwright-preset',
  testPathIgnorePatterns: ['/node_modules/', 'lib'],
  // setupFilesAfterEnv: ['./jest.config.ts'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: true,
  coverageDirectory: "coverage",
  testEnvironmentOptions: {
    "jest-playwright": {
      browsers: ["chromium"],
      launchOptions: {
        headless: true,
      }
    }
  },
  collectCoverage: true,
  automock: true,
}

export default config;