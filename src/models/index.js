// PostgreSQL Models (User class for structured queries)
import { sql } from "../config/psql.js"

export class User {
  static async findById(id) {
    const result = await sql`SELECT * FROM users WHERE id = ${id}` ;
    return result[0] || null;
  }

  static async findByEmail(email) {
    const result = await sql ` SELECT * FROM users WHERE email = ${email}`;
    return result[0] || null;
  }

  static async create(userData) {
    const { email, password, name } = userData;

    const result = await sql ` INSERT INTO users (email, password, name, created_at) VALUES (${email}, ${password}, ${name}, NOW()) RETURNING *`; 
    return result[0];
  }

  // Ik pretty ugly and inefficient, BUT PSQL is failing at everything else 
  static async update(id, updates) {

    const result = await sql ` 
    UPDATE users 
    SET
      name = COALESCE(${updates.name},name) ,
      email = COALESCE(${updates.email},email),
      password = COALESCE(${updates.password},password),
      phone = COALESCE(${updates.phone},phone),
      avatar = COALESCE(${updates.avatar},avatar) ,
      currency = COALESCE(${updates.currency},currency) ,
      language = COALESCE(${updates.language},language)
    WHERE id = ${id}
    RETURNING * 
    `;

    return result[0];
  }
}

  


// MongoDB Models (Mongoose schemas for transactions)

// Removed Transaction and product Query schema  
