import { Router } from "express";
import { checkApiKey } from "../../auth/authUtils";
import mailRouter from "./mail/mail.routes";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = Router();

router.use(asyncHandler(checkApiKey));
router.use("/email", mailRouter);

export default router;
