require("dotenv").config();

import { IScheduler, Scheduler } from "./scheduler";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("init email");

type Email = {
  from: string;
  to: string;
  subject: string;
  body: string;
};

type ResendResponse = {
  name: string,
  message: string,
  statusCode: number
}

export class EmailScheduler extends Scheduler {
  from: string;
  to: string;
  subject: string;
  body: string;

  constructor({ from, to, subject, body }: Email) {
    console.log("init email");
    // super("*/1 * * * * *"); // 1 sec
    super("*/1 * * * *"); // 1 min

    this.from = from;
    this.to = to;
    this.subject = subject;
    this.body = body;
  }

  private sendEmail(): Promise<IScheduler> {
    return new Promise(async (resolve, reject) => {
      let params = {
        from: "Acme <onboarding@resend.dev>",
        to: ["tomasbarrios@protonmail.com"],
        subject: "Hello World",
        html: "<strong>it works!</strong>",
      };

      if (process.env.NODE_ENV === "production") {
        params = {
          from: this.from,
          to: [this.to],
          subject: this.subject,
          html: this.body,
        };
      }

      try {
        const data = await resend.emails.send(params);
        // console.log("EmailScheduler:", {data})

        const emailStatus: IScheduler = {
          success: true,
          error: new Error(`Failed when attemptin to send with ${JSON.stringify(data)}`),
        };
        resolve(emailStatus);
      } catch (error: unknown) {
        const emailStatus: IScheduler = {
          success: false,
          error: new Error("error"),
        };
        reject(emailStatus);
      }
    });
  }

  executeJob(): Promise<IScheduler> {
    return new Promise(async (resolve, reject) => {
      const data = await this.sendEmail();
      console.log("EmailScheduler Result", { result: data });
      resolve(data);
    });
  }
}
