import { sql } from '../config/psql.js';

const errMessage = (operation) => {
  return `Error ${operation} budget data from database`;
};

export async function createBudget(userId, categoryId, amount, period, startDate, endDate) {
  try {
    const create = await sql`
      INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
      VALUES (${userId}, ${categoryId}, ${amount}, ${period || 'monthly'}, ${startDate || new Date().toISOString()}, ${endDate || null})
      RETURNING * 
    `;
    return create[0];
  } catch (error) {
    console.error(errMessage("inserting"), error);
    throw error;
  }
}

export async function getBudgetsByUserId(userId) {
  try {
    const get = await sql`
      SELECT 
        b.id, b.user_id, b.category_id, b.amount, b.period, b.start_date, b.end_date, b.created_at, b.updated_at,
        c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM 
        budgets b
      JOIN 
        categories c ON b.category_id = c.id
      WHERE 
        b.user_id = ${userId}
      ORDER BY b.created_at DESC
    `;
    return get;
  } catch (error) {
    console.error(errMessage("selecting"), error);
    throw error;
  }
}


export async function updateBudget(budgetId, amount) {
  try {
    const update = await sql`
      UPDATE budgets 
      SET 
        amount = ${amount},
        updated_at = NOW()
      WHERE 
        id = ${budgetId}
      RETURNING * 
    `;
    return update[0];
  } catch (error) {
    console.error(errMessage("updating"), error);
    throw error;
  }
}


export async function deleteBudget(budgetId) {
  try {
    const delBudget = await sql`
      DELETE 
        FROM budgets 
      WHERE 
        id = ${budgetId}
      RETURNING * 
    `;
    return delBudget[0];
  } catch (error) {
    console.error(errMessage("deleting"), error);
    throw error;
  }
}
