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

  static sendMail = ({
    name,
    from,
    to,
    description,
    contactMetadata,
  }: {
    name: string;
    from?: string;
    to?: string;
    description?: string;
    contactMetadata?: {
      [k: string]: string;
    };
  }) => {
    if (!name || !from || !to) {
      throw new BadRequestError({
        message: "Missing fields",
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
    const newContactEmailHTML = newContactTemplate({ email: from, description });
    const newContactEmailOpts = {
      from: `no-reply@portfolio-mailer-nine.vercel.app`,
      to: `${to}`,
      subject: `New contact request from ${name}`,
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
    const receivedContactEmailHTML = receivedContactTemplate({ name, email: from, contactMetadata });
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
