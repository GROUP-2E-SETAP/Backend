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

  // cleaner neon equivalent 
  static async update(id, updates) {
    const result = await sql ` 
    UPDATE users 
    SET ${sql(updates)}
    WHERE id = ${id}
    RETURNING * 
    `;

    return result[0];
  }
}

  


// MongoDB Models (Mongoose schemas for transactions)

// Removed Transaction and product Query schema  
