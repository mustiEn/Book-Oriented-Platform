import tracerLogger from "tracer";
import { sequelize } from "../models/db.js";
import { QueryTypes } from "sequelize";

import "colors";
// import nodemailer from 'nodemailer'

const logger = tracerLogger.colorConsole({
  format: "({{timestamp}} ~~ in {{file}}:{{line}}) ==> {{message}}".blue,
  dateformat: "HH:MM:ss",
});

const returnRawQuery = (query, queryType) => {
  return sequelize.query(query, {
    type: queryType || QueryTypes.SELECT,
  });
};

// utils/reviewer.js
let reviewer;

const initializeReviewer = async () => {
  try {
    reviewer = await pipeline(
      "sentiment-analysis",
      "Xenova/bert-base-multilingual-uncased-sentiment",
      { dtype: "fp16" }
    );
    console.log("Reviewer initialized successfully.");
  } catch (error) {
    console.log("Failed to initialize reviewer:", error);
  }
};

const sum = (a, b) => {
  return a + b;
};

// const sendMail = async (recipient, val) => {
//     try {
//         let config = {
//             service: 'gmail',
//             auth: {
//                 user: process.env.GMAIL_APP_USER,   // your email address
//                 pass: process.env.GMAIL_APP_KEY // your password
//             }
//         }

//         let transporter = nodemailer.createTransport(config);

//         let message = {
//             from: process.env.GMAIL_APP_USER, // sender address
//             to: recipient, // list of receivers
//             subject: 'Welcome to ABC Website!', // Subject line
//             html: `<a href='http://localhost:8081/verify-email?token=${val}'>Click here to verify your account</a>`
//         };

//         const info = await transporter.sendMail(message);
//         logger.log('============= EMAIL SENT:', info)
//     } catch (error) {
//         throw error
//     }
// }

export { logger, returnRawQuery, sum, reviewer, initializeReviewer };
