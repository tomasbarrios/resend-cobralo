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
import { getAllEmailsPendingToBeSent } from "./src/services/deliveryAttempts";
import { EmailScheduler } from "./src/EmailScheduler";

/**
 * init
 */
const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);
//const app = express();

async function main() {
    if (!process.env.RESEND_API_KEY) {
      throw `Abort: You need to define RESEND_API_KEY in the .env file.`;
    } else {
      
      const deliveryAttempts = await getAllEmailsPendingToBeSent();

      for(const da of deliveryAttempts) {
        const { from, to, subject, body } = da
        const emailJob = new EmailScheduler({ 
          from, to, subject, body
        })

      console.log("emailJob response", {emailJob});

      }
      console.log("done", {deliveryAttempts});
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

