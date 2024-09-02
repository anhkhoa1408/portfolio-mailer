import nodemailer from "nodemailer";
import { BadRequestError } from "../core/error.response";

class MailService {
  static checkValidEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  static sendMail = ({ from, to }: { from?: string; to?: string; description?: string }) => {
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
      host: "in-v3.mailjet.com", // Mailjet SMTP server
      port: 587, // Use port 587 for TLS (or 465 for SSL)
      secure: false, // Set to false for TLS
      auth: {
        user: process.env.MAILJET_API_KEY, // Replace with your Mailjet API Key
        pass: process.env.MAILJET_SECRET_KEY, // Replace with your Mailjet Secret Key
      },
    });

    const mailOptions = {
      from: `No Reply <${from}>`,
      to: `${to}`,
      subject: "NEW CONTACT REQUEST", // Subject line
      html: "<b>Hello!</b> This is a test email sent using Nodemailer and Mailjet.", // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new BadRequestError({ message: error.message });
      }
    });
  };
}

export default MailService;
