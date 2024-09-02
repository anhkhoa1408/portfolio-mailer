import { NextFunction, Request, Response, RequestHandler } from "express";

export const asyncHandler = (
  callback: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};
