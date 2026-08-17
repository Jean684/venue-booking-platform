/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/test"],
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  clearMocks: true,
};