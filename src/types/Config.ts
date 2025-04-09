export interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  finnhubApiKey: string;
  alphaVantageApiKey: string;
  frontendUrl: string;
}
