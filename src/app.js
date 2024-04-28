import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import healthzRoute from "./routes/healthzRoute.js";
import userRoute from "./routes/userRoute.js";
import { routeMiddleware } from "./middlewares/routeMiddleware.js";
import { bootstrapDB } from "./databaseConfig/bootstrapDb.js";
import mysql from "mysql2";


// Initialize express app
const app = express();

//dotenv config
dotenv.config();

// Bootstrap DB
const boot = async () => {
  await bootstrapDB();
}
boot();


// Set default Middlewares
app.use(express.json());
app.use(morgan("dev"));
// app.use(cors());

// Set middleware to add response header
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  next();
});

// handle edge cases related to routing
// app.use(routeMiddleware);

// Use Routes
app.use("/healthz", healthzRoute);

app.use("/v2/user", userRoute);

// Wildcard route
app.use("*", (req, res) => {
  res.status(404).json();
});

export default app;
