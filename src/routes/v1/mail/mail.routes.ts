import { Router } from "express";
import { asyncHandler } from "../../../helpers/asyncHandler";
import mailController from "../../../controllers/mail.controller";

const router = Router();

router.post("/send", asyncHandler(mailController.sendMail));

export default router;
