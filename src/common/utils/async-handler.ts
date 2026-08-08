import { NextFunction, Request, RequestHandler, Response } from "express";
import { ParsedQs } from "qs";

export function asyncHandler<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
