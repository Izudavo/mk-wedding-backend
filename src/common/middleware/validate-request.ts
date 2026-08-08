import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

import { AppError } from "../errors/AppError";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message ?? "Validation failed."
        )
      );
    }

    req.body = result.data;

    next();
  };
