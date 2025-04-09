import config from "../config";
import axios, { AxiosResponse } from "axios";

export class FinnhubService {
  static async proxyRequest(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1${endpoint}`, {
        params: {
          ...params,
          token: config.finnhubApiKey,
        },
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error("Rate limit exceeded for Finnhub API");
      }
      throw new Error(error.message || "Error connecting to Finnhub API");
    }
  }
}
