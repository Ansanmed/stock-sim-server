import dotenv from "dotenv";
import { Config } from "../types/Config";

dotenv.config();

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/portfolio",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  finnhubApiKey: process.env.FINNHUB_API_KEY || "",
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:4200",
};

export default config;
