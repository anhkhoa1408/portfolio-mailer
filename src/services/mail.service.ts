import nodemailer from "nodemailer";
import { BadRequestError } from "../core/error.response";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

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

    // New contact email
    const newContactTemplateSource = fs.readFileSync(
      path.join(__dirname, "..", "template", "new-contact-email.hbs"),
      "utf8",
    );
    const newContactTemplate = Handlebars.compile(newContactTemplateSource);
    const newContactEmailHTML = newContactTemplate({ email: from, description: description });
    const newContactEmailOpts = {
      from: `no-reply@portfolio-mailer-nine.vercel.app`,
      to: `${to}`,
      subject: "New contact",
      html: newContactEmailHTML,
    };
    transporter.sendMail(newContactEmailOpts, (error, info) => {
      if (error) {
        throw new BadRequestError({ message: error.message });
      }
    });

    // Thank sender email
    const receivedContactTemplateSource = fs.readFileSync(
      path.join(__dirname, "..", "template", "received-contact-email.hbs"),
      "utf8",
    );
    const receivedContactTemplate = Handlebars.compile(receivedContactTemplateSource);
    const receivedContactEmailHTML = receivedContactTemplate({ email: from });
    const receivedContactEmailOpts = {
      from: `no-reply@portfolio-mailer-nine.vercel.app`,
      to: `${from}`,
      subject: "Thank you for contacting",
      html: receivedContactEmailHTML,
    };
    transporter.sendMail(receivedContactEmailOpts, (error, info) => {
      if (error) {
        throw new BadRequestError({ message: error.message });
      }
    });
  };
}

export default MailService;
