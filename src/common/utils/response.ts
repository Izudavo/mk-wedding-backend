import { Response } from "express";

export function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}