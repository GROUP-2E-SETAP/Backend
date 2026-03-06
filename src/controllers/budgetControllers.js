import { 
  createBudget,
  getBudgetsByUserId,
  updateBudget,
  deleteBudget
} from '../services/budgetServices.js';
import ResponseHandler from '../utils/responseHandler.js';

export async function addBudget(req, res) {
  try {
    const { userId, categoryId, amount, period, startDate, endDate } = req.body;

    if (!userId || !categoryId || typeof amount === 'undefined') {
      return ResponseHandler.badRequest(res, "userId, categoryId, and amount are required fields");
    }

    const newBudget = await createBudget(userId, categoryId, amount, period, startDate, endDate);

    if (newBudget) return ResponseHandler.success(res, newBudget);
    return ResponseHandler.error(res);

  } catch (error) {
    console.log("Error creating budget: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function getBudgets(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return ResponseHandler.badRequest(res, "userId is required");
    }

    const budgets = await getBudgetsByUserId(userId);

    if (budgets) return ResponseHandler.success(res, budgets);
    return res.status(400).json("Error fetching budgets");

  } catch (error) {
    console.log("Error fetching budgets: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function updateExistingBudget(req, res) {
  try {
    const { budgetId } = req.params;
    const { amount } = req.body;

    if (!budgetId || typeof amount === 'undefined') {
        return ResponseHandler.badRequest(res, "budgetId and amount are required fields");
    }

    const updatedBudget = await updateBudget(budgetId, amount);

    if (updatedBudget) return ResponseHandler.success(res, updatedBudget);
    return ResponseHandler.error(res, "Budget not found or could not be updated");

  } catch (error) {
    console.log("Error updating budget: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function removeBudget(req, res) {
  try {
    const { budgetId } = req.params;

    if (!budgetId) return ResponseHandler.badRequest(res, "budgetId is required");
    
    const deletedBudget = await deleteBudget(budgetId);

    if (deletedBudget) return ResponseHandler.success(res, deletedBudget);
   
    return ResponseHandler.error(res, "Budget not found or could not be deleted");
  } catch (error) {
    console.log("Error deleting budget: ", error);
    return ResponseHandler.serverError(res, error);
  }
}
