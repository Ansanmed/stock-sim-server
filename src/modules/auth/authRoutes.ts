import { Router, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { AppError } from "../../errors/AppError";
import { errorCodes } from "../../errors/errorCodes";
import { AuthService } from "./authService";

const router = Router();

interface AuthRequestBody {
  email: string;
  password: string;
}

router.post(
  "/register",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        HttpStatusCode.BadRequest,
        errorCodes.general.BAD_REQUEST
      );
    }

    const { user, accessToken } = await AuthService.register(email, password);
    res.status(HttpStatusCode.Created).json({
      message: "User registered",
      userId: user._id,
      accessToken,
    });
  }
);

router.post(
  "/login",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        HttpStatusCode.BadRequest,
        errorCodes.general.BAD_REQUEST
      );
    }

    const token = await AuthService.login(email, password);
    res.status(HttpStatusCode.Ok).json({ token });
  }
);

export default router;
