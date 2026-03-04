import { 
  createCat
} from '../services/categoryServices.js'

export async function createCategory(req,res) {
  try {
    const { userId , catName , type } = req.body  ; 

    if (!userId || !catName || !type){
      return res.status(400).json({message : "All fields requried"});
    }

    const createService  = await createCat(userId,catName,type) ;

    if (createService) return res.status(200).json(createService) ;
    return res.status(400).json({message : "Error creating category " }) ;

  } catch (error) {
    console.log("Error creating category : " , error) ; 
    return res.status(500).json({message : "Internal server error "}) ;
  }
}


export async function getCategoryByUserId (req,res) {
  try {
    
  } catch (error) {
    console.log("Error fetching category : " , error) ; 
    return res.status(500)
  }
}
