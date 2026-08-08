import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/jwt";

export function adminAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Unauthorized."));
  }

  const [, token] = header.split(" ");

  if (!token) {
    return next(new AppError(401, "Unauthorized."));
  }

  try {
    verifyToken(token);

    next();
  } catch {
    next(new AppError(401, "Unauthorized."));
  }
}
