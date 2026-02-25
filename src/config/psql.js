import 'dotenv/config'
import { neon } from '@neondatabase/serverless' 
import config from "./index.js"

export const sql = neon(config.postgresUri) ;

export async function initPSQL() {
  try {
    // TO-DO : SQL queries 
    console.log() ; 
  } catch (error) {
    console.log("Error while initalising PSQL client : " , error) ; 
  }
}
