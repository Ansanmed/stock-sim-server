import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";
import { HttpStatusCode } from "axios";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // Set one minute
  max: 60, // Max queries per minute
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError(
        "Too many requests, please try again later.",
        HttpStatusCode.TooManyRequests,
        errorCodes.general.BAD_REQUEST
      )
    );
  },
});
