import { sql } from "../config/psql.js";

export async function createTrxModal(userId,categoryId,amount,description,date) {
  try {
    const create = await sql`
      INSERT INTO transactions (user_id, category_id, amount, description, date)
      VALUES (${userId}, ${categoryId}, ${amount}, ${description}, ${date || new Date().toISOString()})
      RETURNING * 
  `;

    return create[0];
  } catch (error) {
    throw error ;
  }
}


export async function getTrxModal(userId) {
  try {
    const get  = await sql`
      SELECT 
        t.id, t.user_id, t.category_id,c.type,c.name, t.amount, t.description, t.date, t.created_at, t.updated_at
      FROM 
        transactions t 
      JOIN 
        categories c 
      ON 
        t.category_id = c.id
      WHERE 
        t.user_id = ${userId}
      ORDER BY date DESC
  `;
    return get ;
  } catch (error) {
    throw error ;
  }
}


export async function deleteTrxModal(transactionId) {
  try {

    const delTransaction = await sql`
      DELETE 
        FROM transactions 
      WHERE 
        id = ${transactionId}
      RETURNING * 
`;

    return delTransaction[0];
  } catch (error) {
    throw error ;
  }
}
