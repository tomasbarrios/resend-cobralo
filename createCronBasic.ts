import cron from 'node-cron';

/**
 * Resend deps
 */
import { Resend } from 'resend';
import express, { Request, Response } from 'express';

/**
 * Prisma deps
 */
import { PrismaClient } from "@prisma/client";

//execute every 2:30am morning
// cron.schedule('30 2 * * *', function(){
//  console.log('running a task every two minutes');
// });


//execute every 1 min
cron.schedule('*/1 * * * *', function(){
    console.log('running a task every two minutes');
});
