import express, { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";
import { HttpStatusCode } from "axios";
import { PortfolioService } from "../services/portfolioService";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const portfolioData = req.body;
    const portfolio = await PortfolioService.createPortfolio(
      req.user!.userId,
      portfolioData
    );
    res.status(HttpStatusCode.Created).json({
      message: "Portfolio created",
      portfolio,
    });
  }
);

router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const portfolios = await PortfolioService.getPortfoliosByUser(
      req.user!.userId
    );
    res.status(HttpStatusCode.Ok).json(portfolios);
  }
);

router.get(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const portfolioId = req.params.id;
    if (!portfolioId) {
      throw new AppError(
        "Id required",
        HttpStatusCode.BadRequest,
        errorCodes.portfolio.PORTFOLIO_ID_REQUIRED
      );
    }
    const portfolio = await PortfolioService.getPortfolioDetails(
      portfolioId,
      req.user!.userId
    );
    res.status(HttpStatusCode.Ok).json(portfolio);
  }
);

router.patch(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const portfolioId = req.params.id;
    const portfolioData = req.body;
    const updatedPortfolio = await PortfolioService.modifyPortfolio(
      portfolioId,
      req.user!.userId,
      portfolioData
    );
    res.status(HttpStatusCode.Ok).json({
      portfolio: updatedPortfolio,
    });
  }
);

export default router;
