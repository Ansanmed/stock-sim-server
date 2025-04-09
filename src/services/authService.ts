import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel, { UserDocument } from "../models/User";
import config from "../config";

export class AuthService {
  static async register(
    email: string,
    password: string
  ): Promise<UserDocument> {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new UserModel({ email, password });
    await user.save();
    return user;
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload: JwtPayload = { userId: user._id.toString() };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
  }
}
