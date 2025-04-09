// Tipos para las respuestas de Finnhub (simplificados)
export interface SearchResponse {
  count: number;
  result: Array<{
    description: string;
    symbol: string;
    type: string;
  }>;
}

export interface QuoteResponse {
  c: number; // Current price
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
}
