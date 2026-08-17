import "@jest/globals";
import { AppDataSource } from "../data-source";
import { afterAll, beforeAll } from "@jest/globals";
import { setupApollo } from "../app";
import { setApp } from "./test-app";

process.env.NODE_ENV = "test";

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
    const a = await setupApollo();
    setApp(a)
  } catch (error) {
    console.error("Error during test database initialization:", error);
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});


