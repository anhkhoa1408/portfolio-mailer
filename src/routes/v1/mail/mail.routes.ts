import { Router } from "express";
import { asyncHandler } from "../../../helpers/asyncHandler";
import mailController from "../../../controllers/mail.controller";
import rateLimit from "express-rate-limit";

const router = Router();

if (process.env.NODE_ENV !== "dev") {
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 2,
    message: "Too many request",
  });
}

router.post(
  "/send",
  (req, res, next) => {
    if (process.env.NODE_ENV !== "dev") {
      const limiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 2,
        message: "Too many request",
      });
      return limiter(req, res, next);
    }
    return next();
  },
  asyncHandler(mailController.sendMail),
);

export default router;
