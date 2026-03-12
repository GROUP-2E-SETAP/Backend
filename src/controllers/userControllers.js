import ResponseHandler from '../utils/responseHandler.js'
import { updateUserService, deleteUserService } from '../services/userServices.js'

export async function updateUser(req,res) {
  try {
    const user_id = req.params.userId ; 
    const result   = await updateUserService(user_id,req.body);
    console.log(result) ; 
    if (result) return ResponseHandler.success(res,result);
  
    return ResponseHandler.error(res);
  } catch (error){
    console.log("Error updating user data : " , error) ; 
  
    if (error.message == "ID required" ) return ResponseHandler.badRequest(res,"ID required") ;
    
    else if (error.message  == "User not found") return ResponseHandler.notFound(res,"User not found ") ; 

    else if (error.message == "No fields provided") return ResponseHandler.badRequest(res,"No fields provided to update") ;
   
    else if (error.message == "Access forbidden") return ResponseHandler.forbidden(res,"Can not access forbidden fields"); 
  
    

    return ResponseHandler.serverError(res,error) ;
  } 
} ; 


export async function deleteUser(req,res) {
  try {
    const userId = req.params.userId ;
    const result = await deleteUserService(userId) ; 
    
    if (result) return ResponseHandler.success(res,result,`User : ${userId} deleted successfully `) ; 
    return ResponseHandler.error(res) ; 

  } catch (error) {
    console.log("Error deleting user : " , error) ; 

    if (error.message == "ID required") return ResponseHandler.badRequest(res,"ID required") ; 
    else if (error.message == "User not found") return ResponseHandler.notFound(res,"User not found") ;
    
    return ResponseHandler.serverError(res,error) ;
  }
}
