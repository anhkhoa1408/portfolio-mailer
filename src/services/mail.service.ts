import fs from "fs";
import Handlebars from "handlebars";
import Mailjet from "node-mailjet";
import path from "path";
import { BadRequestError } from "../core/error.response";

class MailService {
  static checkValidEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  static sendMail = async ({
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

    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY || "your-api-key",
      apiSecret: process.env.MAILJET_SECRET_KEY || "your-api-secret",
    });

    // New contact email
    const newContactTemplateSource = fs.readFileSync(
      path.join(__dirname, "..", "template", "new-contact-email.hbs"),
      "utf8",
    );
    const newContactTemplate = Handlebars.compile(newContactTemplateSource);
    const newContactEmailHTML = newContactTemplate({ email: from, description });
    try {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "no-reply@portfolio-mailer-nine.vercel.app",
              Name: "",
            },
            To: [
              {
                Email: to,
                Name: name,
              },
            ],
            Subject: `New contact request from ${name}`,
            HTMLPart: newContactEmailHTML,
          },
        ],
      });
    } catch (err: any) {
      throw new BadRequestError({
        message: err?.response as string,
      });
    }

    // Thank sender email
    const receivedContactTemplateSource = fs.readFileSync(
      path.join(__dirname, "..", "template", "received-contact-email.hbs"),
      "utf8",
    );
    const receivedContactTemplate = Handlebars.compile(receivedContactTemplateSource);
    const receivedContactEmailHTML = receivedContactTemplate({ name, email: from, contactMetadata });
    try {
      const res = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "no-reply@portfolio-mailer-nine.vercel.app",
              Name: "",
            },
            To: [
              {
                Email: from,
                Name: "",
              },
            ],
            Subject: "Thank you for contacting",
            HTMLPart: receivedContactEmailHTML,
          },
        ],
      });
      return res.response.data;
    } catch (err: any) {
      throw new BadRequestError({
        message: err?.response as string,
      });
    }
  };
}

export default MailService;
