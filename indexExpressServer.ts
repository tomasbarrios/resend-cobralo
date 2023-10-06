require('dotenv').config()

/**
 * Resend deps
 */
import { Resend } from 'resend';
import express, { Request, Response } from 'express';

/**
 * Prisma deps
 */
import { PrismaClient } from "@prisma/client";
import { EmailScheduler } from './src/EmailScheduler';

/**
 * init
 */
const prisma = new PrismaClient()

const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();

app.get('/', async (req: Request, res: Response) => {
  try {
    let params = {
      from: 'Acme <onboarding@resend.dev>',
      to: ['tomasbarrios@protonmail.com'],
      subject: 'Hello World',
      html: '<strong>it works!</strong>',
    }
    if(process.env.NODE_ENV === 'production'){
      params = {
        from: 'Acme <onboarding@resend.dev>',
        to: ['tomasbarrios@protonmail.com'],
        subject: 'Hello World',
        html: '<strong>it works!</strong>',
      };  
    }
    
    const data = await resend.emails.send(params)
    res.status(200).json(data);
  } catch(error) {
    res.status(400).json(error);
  }
})

// Get pending notifications from Debts
app.get('/pending', async (req, res) => {
  const users = await prisma.reminder.findMany()
  res.json(users)
})

app.get('/on', async (req, res) => {
  const emailJob = new EmailScheduler({ from: "", to: "", body: "", subject: ""});
  res.status(200).send("Jobs for testing email are Initiated");
})


app.listen(3000, () => {
  if (!process.env.RESEND_API_KEY) {
    throw `Abort: You need to define RESEND_API_KEY in the .env file.`;
  } else {
    console.log(process.env.RESEND_API_KEY)
  }
  
  console.log('Listening on http://localhost:3000');
});
