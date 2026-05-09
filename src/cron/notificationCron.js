import cron from "node-cron"
import { sql } from "../config/psql"
import { createNotification } from "../services/notificationServices";

async function getAllUserId () {
  try {
   const get = await sql `
    SELECT 
      id 
    FROM 
      USERS 
    WHERE 
      role = 'user' 
    `;

    console.log(get[0]);

    return get;
  
  } catch (error) {
    console.error(`Error fetching data from database : Notification Cron error`);
    return ;  
  }
}


async function runJob() {
  try {
    const users = await getAllUserId() ; 
    if(!users.length) return ; 

  for (const user of users) {

    };
  } catch (error){
    console.error(`Error running cron Job : notification Cron Error `)
  }
}
