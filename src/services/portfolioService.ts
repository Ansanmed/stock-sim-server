import Portfolio, { IPortfolio } from "../models/schemas/Portfolio";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";
import { HttpStatusCode } from "axios";
import { PortfolioSummary } from "../models/interfaces/PortfolioSummary";

export class PortfolioService {
  private static async generateUniqueName(
    userId: string,
    baseName: string,
    excludePortfolioId?: string
  ): Promise<string> {
    let name = baseName;
    let counter = 1;

    while (
      await Portfolio.findOne({
        userId,
        name,
        _id: { $ne: excludePortfolioId },
      })
    ) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    return name;
  }

  static async createPortfolio(
    userId: string,
    portfolio: PortfolioSummary
  ): Promise<IPortfolio> {
    if (!portfolio.name) {
      throw new AppError(
        "Portfolio name is required",
        HttpStatusCode.BadRequest,
        errorCodes.portfolio.PORTFOLIO_NAME_REQUIRED
      );
    }

    const uniqueName = await this.generateUniqueName(userId, portfolio.name);

    const newPortfolio = new Portfolio({
      ...portfolio,
      name: uniqueName,
      userId,
      composition: portfolio.composition || [],
    });

    return await newPortfolio.save();
  }

  static async getPortfoliosByUser(userId: string): Promise<IPortfolio[]> {
    return await Portfolio.find({ userId }).exec();
  }

  static async getPortfolioDetails(
    portfolioId: string,
    userId: string
  ): Promise<IPortfolio> {
    const storedPortfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId,
    });
    if (!storedPortfolio) {
      throw new AppError(
        "Portfolio Not found",
        HttpStatusCode.NotFound,
        errorCodes.portfolio.PORTFOLIO_NOT_FOUND
      );
    }
    return storedPortfolio;
  }

  static async modifyPortfolio(
    portfolioId: string,
    userId: string,
    portfolio: PortfolioSummary
  ): Promise<IPortfolio> {
    const storedPortfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId,
    });
    if (!storedPortfolio) {
      throw new AppError(
        "Portfolio not found",
        HttpStatusCode.NotFound,
        errorCodes.portfolio.PORTFOLIO_NOT_FOUND
      );
    }

    let updatedName = storedPortfolio.name;
    if (portfolio.name && portfolio.name !== storedPortfolio.name) {
      updatedName = await this.generateUniqueName(
        userId,
        portfolio.name,
        portfolioId
      );
    }

    storedPortfolio.name = updatedName;
    if (portfolio.description !== undefined) {
      storedPortfolio.description = portfolio.description;
    }
    if (portfolio.composition !== undefined) {
      storedPortfolio.composition = portfolio.composition;
    }

    return await storedPortfolio.save();
  }
}
