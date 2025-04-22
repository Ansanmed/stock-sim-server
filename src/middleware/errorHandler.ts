import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        status: err.status,
        message: err.message,
        code: err.code,
      },
    });
  }

  res.status(500).json({
    error: {
      status: 500,
      message: "Server Error",
      code: errorCodes.server.INTERNAL_SERVER_ERROR,
    },
  });
};
