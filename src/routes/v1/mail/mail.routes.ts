import { Router } from "express";
import { asyncHandler } from "../../../helpers/asyncHandler";
import mailController from "../../../controllers/mail.controller";
import rateLimit from "express-rate-limit";

const router = Router();

const emailApiLimiter = {
  windowMs: 5 * 60 * 1000,
  limit: 2,
  message: "Too many request",
};

router.post(
  "/send",
  rateLimit(process?.env?.NODE_ENV !== "dev" ? emailApiLimiter : {}),
  asyncHandler(mailController.sendMail),
);

export default router;
