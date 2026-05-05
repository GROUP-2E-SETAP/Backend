import { 
  createCat,
  getCat ,
  deleteCat
} from '../services/categoryServices.js'
import ResponseHandler from '../utils/responseHandler.js'

export async function createCategory(req,res) {
  try {
    const { userId , catName , type } = req.body  ; 

    if (!userId || !catName || !type){
      return ResponseHandler.badRequest(res,"All fields required ")
    }

    const createService  = await createCat(userId,catName,type) ;

    if (createService) return ResponseHandler.success(res,createService); 
    return ResponseHandler.error(res);

  } catch (error) {
    console.log("Error creating category : " , error) ; 
    return ResponseHandler.serverError(res,error);
  }
}


export async function getCategoryByUserId (req,res) {
  try {
    const { userId }  = req.params ; 

    const getService = await getCat(userId) ;

    if (getService) return  ResponseHandler.success(res,getService) ; 
    return res.status(400).json("Error fethcing categories ") ;

  } catch (error) {
    console.log("Error fetching category : " , error) ; 
    return ResponseHandler.serverError(res,error); 
  }
}


export async function deleteCategory (req,res) {
  try {
    const { catId }  = req.body ;

    if (!catId) return ResponseHandler.badRequest(res,"All fields required " ) ; 
    const deleteService = await deleteCat(catId) ;

    if (deleteService) return ResponseHandler.success(res);
   
    return ResponseHandler.error(res);
  } catch (error) {
    console.log("Error deleting categories : " ,error) ;
    return ResponseHandler.serverError(res,error); 
  }
}
