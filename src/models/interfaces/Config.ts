export interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  finnhubApiKey: string;
  finnhubApiUrl: string;
  alphaVantageApiKey: string;
  alphaVantageApiUrl: string;
  frontendUrl: string;
}
