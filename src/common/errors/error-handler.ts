import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

import { AppError } from "./AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      message: "Database operation failed.",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
}
