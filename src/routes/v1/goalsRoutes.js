import express from "express";
import { createGoals,updateGoals,deleteGoals } from "../../controllers/goalsControllers";

const router = express.Router();

router.post("/", createGoals);
router.patch("/", updateGoals);
router.delete("/", deleteGoals);

export default router;
