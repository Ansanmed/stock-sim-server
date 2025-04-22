import { MonetaryAmount } from "./MonetaryAmount";

export interface PortfolioSummary {
  name: string;
  description?: string;
  composition: {
    tick: string;
    tickName: string;
    qty: number;
    purchasePrice: MonetaryAmount;
  }[];
  currency: string;
  createdAt: string;
  updatedAt: string;
}
