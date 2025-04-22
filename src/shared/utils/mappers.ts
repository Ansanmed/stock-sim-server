import { StockCandle } from "../../models/interfaces/StockCandle";
import { TimeSeriesData } from "../../models/interfaces/TimeSeriesData";

export function mapToStockCandles(timeSeries: TimeSeriesData): StockCandle[] {
  return Object.keys(timeSeries).map((date) => ({
    date,
    open: parseFloat(timeSeries[date]["1. open"]),
    high: parseFloat(timeSeries[date]["2. high"]),
    low: parseFloat(timeSeries[date]["3. low"]),
    close: parseFloat(timeSeries[date]["4. close"]),
    volume: parseInt(timeSeries[date]["5. volume"], 10),
  }));
}
