import express from "express";
import cors from "cors";
import venueRoutes from "./routes/venue.routes";
import applicationRoutes from "./routes/application.routes";
import userRoutes from "./routes/user.routes";
import blockdateRoutes from "./routes/blockdate.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", venueRoutes);
app.use("/api", applicationRoutes);
app.use("/api", userRoutes);
app.use("/api", blockdateRoutes);
app.use("/api", analyticsRoutes);

export default app;