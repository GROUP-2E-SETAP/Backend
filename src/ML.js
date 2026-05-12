import axios from "axios";
import { getTrxModal } from "./models/transactionModals.js";
import config from "./config/index.js"; 


const ML_URI = config.ML_URI;

export default async function triggerMLAnalysis(userId) {
  try {
    const transactions = await getTrxModal(userId);

    const currentBalance = transactions.reduce((acc, t) => {
      if (!t.type) return acc;
      return t.type === "income" ? acc + Number(t.amount) : acc - Number(t.amount);
    }, 0) + 10000;

    const payload = {
      userId : String(userId),
      currentBalance,
      transactions: transactions.map((t) => ({
        date:     t.date,
        amount:   Number(t.amount),
        type:     t.type,           
        category: t.name,
      })),
    };

    const response = await axios.post(`${ML_URI}/predict`, payload);
    console.log(response.data);

  } catch (error) {
  if (error.response) {
      console.error("ML 422 detail:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("ML analysis failed (non-fatal):", error.message);
    }
    }
}
