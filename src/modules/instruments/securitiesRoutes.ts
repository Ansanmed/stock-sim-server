import { Router, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { AppError } from "../../errors/AppError";
import { errorCodes } from "../../errors/errorCodes";
import { FinnhubService } from "./finnhubSrvice";

const router = Router();

router.get("/search", async (req: Request, res: Response, next) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm || typeof searchTerm !== "string") {
      throw new AppError(
        "search term invalid",
        HttpStatusCode.BadRequest,
        errorCodes.stocks.SEARCH_TERM_REQUIRED_OR_INVALID
      );
    }
    const response = await FinnhubService.securitySearch(searchTerm);
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

export default router;
