import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { AlphaVantageService } from "../services/alfphaVantageService";
import { RequestWithUser } from "../types/RequestWithUser";

const router = Router();

router.get(
  "/stock/candle",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { symbol, interval, outputsize } = (
        req as unknown as RequestWithUser
      ).query;

      if (!symbol) {
        return res.status(400).json({ message: "Symbol is required" });
      }

      const response = await AlphaVantageService.getStockCandles(
        symbol as string,
        interval as string,
        outputsize as string
      );
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
