import { z } from "zod";

export const MonetaryAmountSchema = z.object({
  value: z.number(),
  currency: z.string(),
});

export const CompositionSchema = z.object({
  tick: z.string(),
  tickName: z.string(),
  qty: z.number(),
  purchasePrice: MonetaryAmountSchema, // Agregar purchasePrice
});

export const PortfolioSchema = z.object({
  name: z.string(),
  description: z.string(),
  composition: z.array(CompositionSchema),
});

export type MonetaryAmountDTO = z.infer<typeof MonetaryAmountSchema>;
export type CompositionDTO = z.infer<typeof CompositionSchema>;
export type PortfolioDTO = z.infer<typeof PortfolioSchema>;
