import { HttpStatusCode } from "axios";
import Portfolio, { IPortfolio } from "../../models/schemas/Portfolio";
import { AppError } from "../../errors/AppError";
import { errorCodes } from "../../errors/errorCodes";
import { PortfolioSchema, PortfolioDTO } from "./dto/PortfolioDTO";

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
    portfolioData: unknown // Datos sin validar
  ): Promise<IPortfolio> {
    // Validar los datos usando el esquema Zod
    const portfolio: PortfolioDTO = PortfolioSchema.parse(portfolioData);

    // Validar que cada elemento de composition tenga purchasePrice
    portfolio.composition.forEach((item) => {
      if (!item.purchasePrice) {
        throw new AppError(
          "Each composition item must include a purchasePrice",
          HttpStatusCode.BadRequest,
          errorCodes.general.BAD_REQUEST
        );
      }
    });

    // Generar un nombre único para el portfolio
    const uniqueName = await this.generateUniqueName(userId, portfolio.name);

    // Crear el nuevo portfolio
    const newPortfolio = new Portfolio({
      ...portfolio,
      name: uniqueName,
      userId,
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
    portfolioData: unknown // Datos sin validar
  ): Promise<IPortfolio> {
    // Validar los datos usando el esquema Zod
    const portfolio: PortfolioDTO = PortfolioSchema.parse(portfolioData);

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
