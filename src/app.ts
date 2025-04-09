import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import authRoutes from "./routes/auth";
import finnhubRoutes from "./routes/finnhub";
import { rateLimiter } from "./middleware/rateLimiter";
import alphaVantageRoutes from "./routes/alphaVantageRoutes";

export const createApp = async (): Promise<Express> => {
  const app = express();

  // MongoDB
  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  // Middlewares
  app.use(cors({ origin: config.frontendUrl, credentials: true }));
  app.use(express.json());
  app.use(rateLimiter);

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/finnhub", finnhubRoutes);
  app.use("/api/alphavantage", alphaVantageRoutes);

  return app;
};
