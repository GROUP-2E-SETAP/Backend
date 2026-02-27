// PostgreSQL Models (User class for structured queries)
import { sql } from "../config/psql.js"

export class User {
  static async findById(id) {
    const result = await sql`SELECT * FROM users WHERE id = ${id}` ;
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    await sql ` SELECT * FROM users WHERE email = ${email}`;
    return result.rows[0] || null;
  }

  static async create(userData) {
    const { email, password, name } = userData;

    const result = await sql ` INSERT INTO users (email, password, name, created_at) VALUES (${email}, ${password}, ${name}, NOW()) RETURNING *`; 
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];

    const result = await sql ` UPDATE users SET ${fields}, updated_at = NOW() WHERE id = ${fields} RETURNING *`; 
    return result.rows[0];
  }
}

// MongoDB Models (Mongoose schemas for transactions)

// Removed Transaction and product Query schema  
