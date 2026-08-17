import { setupApollo } from "./app";
import { AppDataSource } from "./data-source";
import cors from "cors";

async function startServer() {

  await AppDataSource.initialize();

  const app = await setupApollo();

  app.listen(4001, () => {
    console.log("Data Source has been initialized!");
  });

}

// startServer();

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);