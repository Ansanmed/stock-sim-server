import { readFileSync } from "fs";

interface SearchResponse {
  count: number;
  result: { description: string; isin: string; symbol: string; type: string }[];
}

interface QuoteResponse {
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
  timestamp: number;
}

interface AllQuotesResponse {
  [market: string]: { isin: string; symbol: string; quote: QuoteResponse }[];
}

// Cargar los datos mockeados desde el archivo JSON
const { mockSearchData, mockQuoteData } = JSON.parse(
  readFileSync("src/data/mockData.json", "utf-8")
);

export const mockService = {
  search: async (query: string): Promise<SearchResponse> => {
    const lowerQuery = query.toLowerCase();
    const results: {
      description: string;
      isin: string;
      symbol: string;
      type: string;
    }[] = [];

    // Buscar coincidencias en nombres, símbolos e ISINs
    for (const key in mockSearchData) {
      const searchData = mockSearchData[key];
      searchData.result.forEach((item: any) => {
        const matchesName = item.description.toLowerCase().includes(lowerQuery);
        const matchesSymbol = item.symbol.toLowerCase() === lowerQuery;
        const matchesIsin = item.isin.toLowerCase() === lowerQuery;
        if (matchesName || matchesSymbol || matchesIsin) {
          results.push(item);
        }
      });
    }

    return { count: results.length, result: results };
  },

  quote: async (isin: string): Promise<QuoteResponse> => {
    const data = mockQuoteData[isin];
    if (!data) {
      throw new Error(`No hay datos disponibles para el ISIN "${isin}"`);
    }
    return data;
  },

  allQuotes: async (): Promise<AllQuotesResponse> => {
    const quotesByMarket: AllQuotesResponse = {};

    // Agrupar cotizaciones por mercado
    for (const key in mockSearchData) {
      const searchData = mockSearchData[key];
      searchData.result.forEach((item: any) => {
        const isin = item.isin;
        const symbol = item.symbol;
        const quote = mockQuoteData[isin];
        if (!quote) return;

        // Determinar el mercado a partir del símbolo
        const match = symbol.match(/\.([A-Z]+)$/);
        const market = match ? match[1] : "US";

        if (!quotesByMarket[market]) {
          quotesByMarket[market] = [];
        }
        quotesByMarket[market].push({ isin, symbol, quote });
      });
    }

    return quotesByMarket;
  },
};
