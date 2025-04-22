import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "../errors/AppError";
import { errorCodes } from "../errors/errorCodes";
import { HttpStatusCode } from "axios";

interface JwtPayload {
  userId: string;
  [key: string]: any;
}

interface AuthenticatedRequest extends Request {
  user?: { userId: string; [key: string]: any };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    throw new AppError(
      "No token provided",
      HttpStatusCode.Unauthorized,
      errorCodes.auth.NO_TOKEN_PROVIDED
    );
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    throw new AppError(
      "Invalid token format",
      HttpStatusCode.Unauthorized,
      errorCodes.auth.INVALID_TOKEN_FORMAT
    );
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        "Token expired",
        HttpStatusCode.Unauthorized,
        errorCodes.auth.TOKEN_EXPIRED
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        "Invalid token",
        HttpStatusCode.Unauthorized,
        errorCodes.auth.INVALID_TOKEN
      );
    }
    throw new AppError(
      "Authentication error",
      HttpStatusCode.Unauthorized,
      errorCodes.auth.AUTHENTICATION_FAILED
    );
  }
};
