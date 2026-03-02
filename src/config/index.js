import 'dotenv/config'

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGO_URI,
  postgresUri: process.env.POSTGRES_URI,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpire: process.env.JWT_EXPIRE || '15m',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  
  // API Keys
  aiApiKey: process.env.AI_API_KEY,
  priceApiKey: process.env.PRICE_API_KEY,
  mapsApiKey: process.env.MAPS_API_KEY,
  
  // Notifications
  fcmServerKey: process.env.FCM_SERVER_KEY,
  emailService: process.env.EMAIL_SERVICE,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  smsApiKey: process.env.SMS_API_KEY,
  
  // Rate Limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,

  // EMAIL service 
  EMAIL_SERVICE : process.env.EMAIL_SERVICE ||  'gmail' ,
  EMAIL_PASSWORD : process.env.EMAIL_PASSWORD ,
  EMAIL_USER : process.env.EMAIL_USER || 'SFT' 

}; 


export default config ; 
