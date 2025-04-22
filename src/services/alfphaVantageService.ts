import axios from "axios";
import config from "../config";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";
import { HttpStatusCode } from "axios";
import { mapToStockCandles } from "../shared/utils/mappers";
import { Interval, OutputSize } from "../models/types/StockCandlesTypes";
import { StockCandle } from "../models/interfaces/StockCandle";
import { TimeSeriesData } from "../models/interfaces/TimeSeriesData";

export class AlphaVantageService {
  static async getStockCandles(
    symbol: string,
    interval: Interval = "daily",
    outputsize: OutputSize = "compact"
  ): Promise<StockCandle[]> {
    if (!config.alphaVantageApiKey) {
      throw new AppError(
        "Alpha Vantage API key is not configured",
        HttpStatusCode.InternalServerError,
        errorCodes.stocks.CANDLE_API_KEY_NOT_CONFIGURED
      );
    }

    if (!symbol || symbol.trim().length === 0) {
      throw new AppError(
        "Symbol is required",
        HttpStatusCode.BadRequest,
        errorCodes.stocks.SEARCH_TERM_REQUIRED_OR_INVALID
      );
    }

    const validIntervals: Interval[] = ["daily", "intraday"];
    if (!validIntervals.includes(interval)) {
      throw new AppError(
        "Invalid interval. Must be 'daily' or 'intraday'",
        HttpStatusCode.BadRequest,
        errorCodes.stocks.CANDLE_INVALID_INTERVAL
      );
    }

    const validOutputSizes: OutputSize[] = ["compact", "full"];
    if (!validOutputSizes.includes(outputsize)) {
      throw new AppError(
        "Invalid outputsize. Must be 'compact' or 'full'",
        HttpStatusCode.BadRequest,
        errorCodes.stocks.CANDLE_INVALID_OUTPUTSIZE
      );
    }

    const functionType =
      interval === "daily" ? "TIME_SERIES_DAILY" : "TIME_SERIES_INTRADAY";

    try {
      const response = await axios.get(`${config.alphaVantageApiUrl}/query`, {
        params: {
          function: functionType,
          symbol,
          outputsize,
          ...(interval === "intraday" && { interval: "60min" }),
          apikey: config.alphaVantageApiKey,
        },
      });

      if (response.data["Error Message"]) {
        throw new AppError(
          response.data["Error Message"],
          HttpStatusCode.BadRequest,
          errorCodes.stocks.STOCK_NOT_FOUND
        );
      }

      const timeSeriesKey =
        interval === "daily" ? "Time Series (Daily)" : "Time Series (60min)";
      const timeSeries: TimeSeriesData = response.data[timeSeriesKey];

      if (!timeSeries || Object.keys(timeSeries).length === 0) {
        throw new AppError(
          "No data returned for the specified symbol",
          HttpStatusCode.NotFound,
          errorCodes.stocks.CANDLE_NO_DATA_RETURNED
        );
      }

      return mapToStockCandles(timeSeries);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new AppError(
          "Rate limit exceeded for Alpha Vantage API",
          HttpStatusCode.TooManyRequests,
          errorCodes.stocks.CANDLE_API_RATE_LIMIT_EXCEEDED
        );
      }
      throw error;
    }
  }
}
