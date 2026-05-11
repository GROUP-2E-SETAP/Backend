import {
  createTrxModal,
  getTrxModal,
  deleteTrxModal
} from "../models/transactionModals.js"
import { response } from "express";
import triggerMLAnalysis from "../ML.js";

const errMessage = (operation) => {
  return `Error ${operation} transaction data from database`;
};


export async function createTransaction(userId, categoryId, amount, description, date) {
  try {
    const response = await createTrxModal(userId,categoryId,amount,description,date);

    triggerMLAnalysis(userId);
      
    return response ;

  } catch (error) {
    console.error(errMessage("inserting"), error);
    throw error;
  }
}

export async function getTransactionsByUserId(userId) {
  try {
    return getTrxModal(userId);
  } catch (error) {
    console.error(errMessage("selecting"), error);
    throw error;
  }
}

export async function deleteTransaction(transactionId) {
  try {
    return deleteTrxModal(transactionId);
  } catch (error) {
    console.error(errMessage("deleting"), error);
    throw error;
  }
}
