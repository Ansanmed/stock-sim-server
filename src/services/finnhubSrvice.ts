import axios, { AxiosResponse } from "axios";
import config from "../config";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";
import { HttpStatusCode } from "axios";
import { FinnhubSearchResult } from "../models/interfaces/FinnhubSearchResult";

export class FinnhubService {
  static async securitySearch(
    searchTerm: string
  ): Promise<FinnhubSearchResult> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new AppError(
        "Search term is required",
        HttpStatusCode.BadRequest,
        errorCodes.stocks.SEARCH_TERM_REQUIRED_OR_INVALID
      );
    }

    const response: AxiosResponse<FinnhubSearchResult> = await axios.get(
      `${config.finnhubApiUrl}/v1/search`,
      {
        params: {
          q: searchTerm,
          exchange: "US",
          token: config.finnhubApiKey,
        },
      }
    );

    if (response.data.count === 0) {
      throw new AppError(
        "No stocks found",
        HttpStatusCode.NotFound,
        errorCodes.stocks.STOCK_NOT_FOUND
      );
    }

    return response.data;
  }
}
