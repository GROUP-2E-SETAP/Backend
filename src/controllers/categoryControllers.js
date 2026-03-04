import { 
  createCat,
  getCat ,
  deleteCat
} from '../services/categoryServices.js'

// for reference REMOVE BEFORE PUSHING 
// -- Categories
// CREATE TABLE IF NOT EXISTS categories (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     name VARCHAR(100) NOT NULL,
//     type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
//     icon VARCHAR(50) DEFAULT 'default',
//     color VARCHAR(7) DEFAULT '#000000',
//     is_default BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
//

// USE responseHandler class this is a messss


export async function createCategory(req,res) {
  try {
    const { userId , catName , type } = req.body  ; 

    if (!userId || !catName || !type){
      return res.status(400).json({
        success : true ,
        message : "All fields requried"
      });
    }

    const createService  = await createCat(userId,catName,type) ;

    if (createService) return res.status(200).json({
      success : true ,
      data : createService 
    }) ;


    return res.status(400).json({
      success : false ,
      message : "Error creating category " 
    }) ;

  } catch (error) {
    console.log("Error creating category : " , error) ; 
    return res.status(500).json({message : "Internal server error "}) ;
  }
}


export async function getCategoryByUserId (req,res) {
  try {
    const { userId }  = req.params ; 

    const getService = await getCat(userId) ;

    if (getService) return res.status(200).json(getService) ; 
    return res.status(400).json("Error fethcing categories ") ;

  } catch (error) {
    console.log("Error fetching category : " , error) ; 
    return res.status(500)
  }
}


export async function deleteCategory (req,res) {
  try {
    const { catId }  = req.body ;

    if (!catId) return res.status(400).json({message : "All fields requried "}) ;

    const deleteService = await deleteCat(catId) ;
  } catch (error) {
    console.log("Error deleting categories : " ,error) ;
    return res.status(500).json({message : "Internal server error "}); 
  }
}
