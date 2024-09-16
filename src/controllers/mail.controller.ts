import { NextFunction, Request, Response } from "express";
import { OK } from "../core/success.response";
import MailService from "../services/mail.service";

class MailController {
  /**
   *
   * @param {String} name
   * @param {String} from
   * @param {String} to
   * @param {String} description
   * @param {Object} contactMetadata
   * @description send email from sender to receiver
   * @returns {JSON}
   */
  sendMail = async (req: Request, res: Response, next: NextFunction) => {
    const {
      name = "",
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
      name,
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
