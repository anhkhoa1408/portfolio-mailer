import nodemailer from "nodemailer";
import { BadRequestError } from "../core/error.response";

class MailService {
  static checkValidEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  static sendMail = ({ from, to, description }: { from?: string; to?: string; description?: string }) => {
    if (!from || !to) {
      throw new BadRequestError({
        message: "Missing from address or to address",
      });
    }

    if (!this.checkValidEmail(from) || !this.checkValidEmail(to)) {
      throw new BadRequestError({
        message: "Invalid email format",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "in-v3.mailjet.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET_KEY,
      },
    });

    const mailOptions = {
      from: `${from}`,
      to: `${to}`,
      subject: "Hello",
      text: description,
      html: "This is a test email", // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new BadRequestError({ message: error.message });
      }
    });
  };
}

export default MailService;
