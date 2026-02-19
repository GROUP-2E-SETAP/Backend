import 'dotenv/config'
import { neon } from '@neondatabase/serverless' 

export const sql = neon(process.env.PSQL_URL) ;

export async function initPSQL() {
  try {
    // TO-DO : SQL queries 
    console.log() ; 
  } catch (error) {
    console.log("Error while initalising PSQL client : " , error) ; 
  }
}
