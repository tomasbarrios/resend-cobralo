require("dotenv").config();

/**
 * Resend deps
 */
import { Resend } from "resend";
//import express, { Request, Response } from 'express';

/**
 * Prisma deps
 */
import { PrismaClient } from "@prisma/client";
// import { EmailScheduler } from "./src/EmailScheduler";
import { getAllRemindersBeforeNow } from "./src/services/reminders";

/**
 * init
 */
const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);
//const app = express();

/**
 * Will find any `Reminder` that should be delivered
 * For each, will create a `Delivery Attempt`
 */
async function main() {
  if (!process.env.RESEND_API_KEY) {
    throw `Abort: You need to define RESEND_API_KEY in the .env file.`;
  } else {
    //   const emailJob = new EmailScheduler();
    // Reminders where notificationDate is NOW, or BEFORE NOW.
    const reminders = await getAllRemindersBeforeNow();
    const results = [];
    for (const r of reminders) {
      const res = await prisma.deliveryAttempt.create({
        data: {
          from: "Acme <onboarding@resend.dev>",
          to: "tomasbarrios@protonmail.com",
          subject: "Hello World",
          body: "<strong>it works!</strong>",
          reminderId: r.id,
        },
      });
      results.push(res);
    }
    console.log("done", { reminders });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
