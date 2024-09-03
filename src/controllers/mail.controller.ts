import { NextFunction, Request, Response } from "express";
import { OK } from "../core/success.response";
import MailService from "../services/mail.service";

class MailController {
  sendMail = async (req: Request, res: Response, next: NextFunction) => {
    const {
      from = "",
      to = "",
      description = "",
      contactMetadata = {
        main: "",
        facebook: "",
        linkedin: "",
        instagram: "",
      },
    } = req.body;
    MailService.sendMail({
      from,
      to,
      description,
      contactMetadata,
    });
    return new OK({
      message: "Send mail successfully",
    }).send(res);
  };
}

const mailController = new MailController();
export default mailController;
