import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../core/error.response";

const HEADERS = {
  API_KEY: "x-api-key",
};

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers[HEADERS.API_KEY]?.toString();
  if (!apiKey || apiKey !== process.env.API_KEY) {
    throw new UnauthorizedError({});
  }
  return next();
};

export { checkApiKey };
