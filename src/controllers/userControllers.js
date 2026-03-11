import ResponseHandler from '../utils/responseHandler.js'
import { User } from '../models/index.js' 
import { updateUserService } from '../services/userServices.js'

export async function updateUser(req,res) {
  try {
    const user_id = req.params.id ; 
    const updates  = await updateUserService(user_id,req.body);
    
    const result = await User.update(user_id,updates) ;
   
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
  
}

