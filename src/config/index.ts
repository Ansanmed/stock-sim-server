import dotenv from "dotenv";
import { Config } from "../models/interfaces/Config";

dotenv.config();

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/portfolio",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  finnhubApiKey: process.env.FINNHUB_API_KEY || "",
  finnhubApiUrl: process.env.FINNHUB_API_URL || "",
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
  alphaVantageApiUrl:
    process.env.ALPHA_VANTAGE_API_URL || "https://www.alphavantage.co/query",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:4200",
};

export default config;
