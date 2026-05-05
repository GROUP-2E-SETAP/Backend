import { sql } from '../config/psql.js';

const errMessage = (operation) => {
  return `Error ${operation} transaction data from database`;
};

export async function createTransaction(userId, categoryId, amount, description, date) {
  try {
    const create = await sql`
      INSERT INTO transactions (user_id, category_id, amount, description, date)
      VALUES (${userId}, ${categoryId}, ${amount}, ${description}, ${date || new Date().toISOString()})
      RETURNING * 
    `;
    return create[0];
  } catch (error) {
    console.error(errMessage("inserting"), error);
    throw error;
  }
}

export async function getTransactionsByUserId(userId) {
  try {
    const get = await sql`
      SELECT 
        id, user_id, category_id, amount, description, date, created_at, updated_at
      FROM 
        transactions 
      WHERE 
        user_id = ${userId}
      ORDER BY date DESC
    `;
    return get;
  } catch (error) {
    console.error(errMessage("selecting"), error);
    throw error;
  }
}

export async function deleteTransaction(transactionId) {
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
    console.error(errMessage("deleting"), error);
    throw error;
  }
}
