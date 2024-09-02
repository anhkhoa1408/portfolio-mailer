import { Router } from "express";
import mailRouter from "./mail/mail.routes";

const router = Router();

router.use("/email", mailRouter);

export default router;
