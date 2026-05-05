import ResponseHandler from "../utils/responseHandler"
import { 
  updateG,
  createG,
  delG
} from "../services/goalsServices"


export async function createGoals(req,res) {
  try {
    const { userId, goalName,targetAmount,deadline} = req.body ;

    if (!userId || !goalName || !targetAmount || !deadline ) {
      return ResponseHandler.badRequest(res,"All fields required");
    }

    if(targetAmount <= 0 ) {
      return ResponseHandler.badRequest(res,"Target amount too small");
    }

    const createGoalService = await createG(userId,goalName,targetAmount,deadline);
    
    if(createGoalService) return ResponseHandler.success(res,createGoalService);
    
    return ResponseHandler.error(res);

  } catch (error) {
    console.error("Error creating goals : " ,error);
    return ResponseHandler.serverError(res,error); 
  }
};


export async function updateGoals(req,res) {
  try {
    const { goalId, newAmount } = req.body ; 

    if (!goalId || !newAmount) {
      return ResponseHandler.badRequest(res,"All fields required ");
    }

    const updateGoalsService = await updateG(goalId,newAmount);

    if(updateGoalsService ) return ResponseHandler.success(res,updateGoalsService);
    
    return ResponseHandler.error(res);

  } catch (error) {
    console.error("Error updating Goals : ",error) ;
    return ResponseHandler.serverError(res,error);
  }
};


export async function deleteGoals(req,res) {
  try {
    const {goalId}  = req.body ; 

    if (!goalId ) return ResponseHandler.badRequest(req,"WHERES THE ID BRO ");

    const deleteGoalService = await delG(goalId);
    
    if(deleteGoalService) return ResponseHandler.success(res,deleteGoalService); 

    return ResponseHandler.error(res);

  }  catch (error) {
    console.error("Error deleting Goals : ",error) ;
    return ResponseHandler.serverError(res,error);
  }
}

