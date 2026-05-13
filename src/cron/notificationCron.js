import { sql } from "../config/psql.js"
import {  getNotificationsByUserId } from "../services/notificationServices.js";
import { getNoSql } from "../config/mongoDb.js";
import nodemailer from "nodemailer";
import config from "../config/index.js";
import cron from "node-cron";

const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE || "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});


const COLLECTION = 'notifications';


async function getAllUserId () {
  try {
   const get = await sql `
    SELECT 
      id , email 
    FROM 
      USERS 
    WHERE 
      role = 'user' 
    `;

    console.log(get[0]);

    return get;
  
  } catch (error) {
    console.error(`Error fetching data from database : Notification Cron error`);
    return [];  
  }
}

async function runJob() {
  try {
    const users = await getAllUserId();
    if (!users.length) return;

    for (const user of users) {
      const unread = await getNotificationsByUserId(user.id);
      if (!unread.length) continue;

      const notificationList = unread
        .map(n => `<li><strong>${n.type}</strong>: ${n.message}</li>`)
        .join("");

      await transporter.sendMail({
        from: `"SETAP Finance" <${config.EMAIL_USER}>`,
        to: user.email,
        subject: "Your Notifications - SETAP Finance",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Your Notifications</h1>
            <ul>${notificationList}</ul>
          </div>
        `,
      });

      const db = getNoSql();
      await db.collection(COLLECTION).updateMany(
        { _id: { $in: unread.map(n => n._id) } },
        { $set: { isRead: true } }
      );

      console.log(`Sent ${unread.length} notification(s) to ${user.email}`);
    }
  } catch (error) {
    console.error(`Error running cron job : notification Cron Error`, error);
  }
}

cron.schedule("0 9 * * *", runJob); 
