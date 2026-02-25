import 'dotenv/config' 
import { MongoClient } from 'mongodb' 
import config from './index.js'

let nosql ; 

export async function initMongoDb() {
  try {
    const client = new MongoClient(config.mongoUri) ; 
    await client.connect() ;

    nosql = client.db("SFT") ; // Student Finance Tracker  

    nosql.createCollection("notifications").catch(() => {}) ; 

    console.log("Successfully connected to MongoDB " ) ; 

  } catch (error) {
    console.log("Error while initialising mongodb : " , error) ;
  }
}

export function getNoSql() {
  if (!nosql) throw new Error ("MongoClient not initalised ") ; 
  return nosql ;
  
}
