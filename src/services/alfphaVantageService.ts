import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../config";

export class AlphaVantageService {
  static async getStockCandles(
    symbol: string,
    interval: string = "daily", // 'daily', 'intraday'
    outputsize: string = "compact" // 'compact' (100 datos) o 'full' (todos los datos)
  ): Promise<AxiosResponse<any>> {
    if (!config.alphaVantageApiKey) {
      throw new Error("Alpha Vantage API key is not configured");
    }

    const functionType =
      interval === "daily" ? "TIME_SERIES_DAILY" : "TIME_SERIES_INTRADAY";
    const intervalParam = interval === "intraday" ? "&interval=60min" : "";

    try {
      const params = {
        function: functionType,
        symbol,
        outputsize,
        ...(interval === "intraday" && { interval: "60min" }),
        apikey: config.alphaVantageApiKey,
      };

      console.log(params);

      const response = await axios.get("https://www.alphavantage.co/query", {
        params,
      });

      // Verificar si hay un error en la respuesta de Alpha Vantage
      if (response.data["Error Message"]) {
        throw new Error(response.data["Error Message"]);
      }

      // Normalizar la respuesta para que sea más fácil de usar
      const timeSeriesKey =
        interval === "daily" ? "Time Series (Daily)" : "Time Series (60min)";
      const timeSeries = response.data[timeSeriesKey];

      if (!timeSeries) {
        throw new Error("No data returned from Alpha Vantage");
      }

      // Convertir el formato de Alpha Vantage a un formato más estándar
      const candles = Object.keys(timeSeries).map((date) => ({
        date,
        open: parseFloat(timeSeries[date]["1. open"]),
        high: parseFloat(timeSeries[date]["2. high"]),
        low: parseFloat(timeSeries[date]["3. low"]),
        close: parseFloat(timeSeries[date]["4. close"]),
        volume: parseInt(timeSeries[date]["5. volume"], 10),
      }));

      return {
        ...response,
        data: candles,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        throw new Error("Rate limit exceeded for Alpha Vantage API");
      }
      throw new Error(
        axiosError.message || "Error connecting to Alpha Vantage API"
      );
    }
  }
}
