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

  static async update(id, updates) {
    const result = await sql`
      UPDATE users SET
        name     = COALESCE(${updates.name     ?? null}, name),
        email    = COALESCE(${updates.email    ?? null}, email),
        phone    = COALESCE(${updates.phone    ?? null}, phone),
        avatar   = COALESCE(${updates.avatar   ?? null}, avatar),
        currency = COALESCE(${updates.currency ?? null}, currency),
        language = COALESCE(${updates.language ?? null}, language),
        password = COALESCE(${updates.password ?? null}, password),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  }
}

// MongoDB Models (Mongoose schemas for transactions)

// Removed Transaction and product Query schema  
