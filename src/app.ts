import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import authRoutes from "./routes/auth";
import { rateLimiter } from "./middleware/rateLimiter";
import securitiesRoutes from "./routes/securities";
import portfolioRoutes from "./routes/portfolioRoutes";
import { errorHandler } from "./middleware/errorHandler";

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
  app.use("/api/securities", securitiesRoutes);
  app.use("/api/portfolio", portfolioRoutes);

  // Error middlewre
  app.use(errorHandler);

  return app;
};
