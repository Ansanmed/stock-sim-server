import { JwtPayload } from "jsonwebtoken";

import { Request } from "express";
import { ParsedQs } from "qs"; // Importa ParsedQs para los query parameters

export interface RequestWithUser
  extends Request<{}, any, any, ParsedQs, Record<string, any>> {
  user?: JwtPayload;
}
