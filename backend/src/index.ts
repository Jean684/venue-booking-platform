import "reflect-metadata";
//import express from "express";
import { AppDataSource } from "./data-source";
// import userRoutes from "./routes/user.routes";
// import venueRoutes from "./routes/venue.routes";
// import applicationRoutes from "./routes/application.routes";
// import userRoutes from "./routes/user.routes";
// import blockdateRoutes from "./routes/blockdate.routes";
// import cors from "cors";
// import analyticsRoutes from "./routes/analytics.routes";
import app from "./app";

//const app = express();
const PORT = process.env.PORT || 3001;

// Move into a separate app file
// Allow Supertest to import the express app without opening a real port = testing
// app.use(cors());
// app.use(express.json());
// app.use("/api", venueRoutes);
// app.use("/api", applicationRoutes);
// app.use("/api", userRoutes);
// app.use("/api", blockdateRoutes);
// app.use("/api", analyticsRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: unknown) =>
    console.log("Error during Data Source initialization:", error)
  );
