import { 
  createTransaction,
  getTransactionsByUserId,
  deleteTransaction
} from '../services/transactionServices.js';
import ResponseHandler from '../utils/responseHandler.js';

export async function createTrx(req, res) {
  try {
    const { userId, categoryId, amount, description, date } = req.body;

    if (!userId || !categoryId || typeof amount === 'undefined') {
      return ResponseHandler.badRequest(res, "userId, categoryId, and amount are required fields");
    }

    const newTransaction = await createTransaction(userId, categoryId, amount, description, date);

    if (newTransaction) return ResponseHandler.success(res, newTransaction);
    return ResponseHandler.error(res);

  } catch (error) {
    console.log("Error creating transaction: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function getTrxByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return ResponseHandler.badRequest(res, "userId is required");
    }

    const transactions = await getTransactionsByUserId(userId);

    if (transactions) return ResponseHandler.success(res, transactions);
    return res.status(400).json("Error fetching transactions");

  } catch (error) {
    console.log("Error fetching transactions: ", error);
    return ResponseHandler.serverError(res, error);
  }
}

export async function deleteTrx(req, res) {
  try {
    const transactionId = req.body.transactionId || req.params.transactionId;

    if (!transactionId) return ResponseHandler.badRequest(res, "transactionId is required");
    
    const deletedTransaction = await deleteTransaction(transactionId);

    if (deletedTransaction) return ResponseHandler.success(res, deletedTransaction);
   
    return ResponseHandler.error(res, "Transaction not found or could not be deleted");
  } catch (error) {
    console.log("Error deleting transaction: ", error);
    return ResponseHandler.serverError(res, error);
  }
}
