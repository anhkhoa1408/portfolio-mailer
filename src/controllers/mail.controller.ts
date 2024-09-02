import { NextFunction, Request, Response } from "express";
import { OK } from "../core/success.response";
import MailService from "../services/mail.service";

class MailController {
  sendMail = async (req: Request, res: Response, next: NextFunction) => {
    MailService.sendMail({
      from: process.env.SENDER_ADDRESS,
      to: process.env.RECEIVER_ADDRESS,
      description: req.body.description,
    });
    return new OK({
      message: "Send mail successfully",
    }).send(res);
  };
}

const mailController = new MailController();
export default mailController;
