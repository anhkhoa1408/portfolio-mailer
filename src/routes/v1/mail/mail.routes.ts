import { Router, Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../helpers/asyncHandler";
import mailController from "../../../controllers/mail.controller";
import rateLimit from "express-rate-limit";
import { ErrorResponse } from "../../../core/error.response";

const router = Router();

const emailApiLimiter = {
  windowMs: 5 * 60 * 1000,
  limit: 2,
  validate: { xForwardedForHeader: false },
  message: (req: Request, res: Response, next: NextFunction) => {
    return res.status(429).json(
      new ErrorResponse({
        message: "Too many request",
        statusCode: 429,
      }),
    );
  },
};

router.post(
  "/send",
  process?.env?.NODE_ENV !== "dev" ? rateLimit(emailApiLimiter) : (req, res, next) => next(),
  asyncHandler(mailController.sendMail),
);

export default router;
