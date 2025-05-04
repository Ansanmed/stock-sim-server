import jwt from "jsonwebtoken";
import { HttpStatusCode } from "axios";
import { AppError } from "../../errors/AppError";
import { errorCodes } from "../../errors/errorCodes";
import config from "../../config";
import UserModel from "../../models/schemas/User";
interface JwtPayload {
  userId: string;
}

export class AuthService {
  static async register(
    email: string,
    password: string
  ): Promise<{ user: { _id: string; email: string }; accessToken: string }> {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError(
        "User already exists",
        HttpStatusCode.BadRequest,
        errorCodes.auth.USER_ALREADY_EXISTS
      );
    }

    const user = new UserModel({ email, password });
    await user.save();

    const payload: JwtPayload = { userId: user._id.toString() };
    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "1h",
    });

    return {
      user: { _id: user._id.toString(), email: user.email },
      accessToken,
    };
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError(
        "Bad Credentials",
        HttpStatusCode.Unauthorized,
        errorCodes.auth.INVALID_CREDENTIALS
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError(
        "Bad Credentials",
        HttpStatusCode.Unauthorized,
        errorCodes.auth.INVALID_CREDENTIALS
      );
    }

    const payload: JwtPayload = { userId: user._id.toString() };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
  }
}
