/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  globalSetup: './dotenv-config.ts',
  //setupFiles: ["dotenv/config"],
}

// setupFiles: ["dotenv/config"],

//setupFiles: ["./config/test/dotenv/testDotenvConfig.ts"]
