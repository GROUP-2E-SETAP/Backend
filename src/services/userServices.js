import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { sql } from '../config/psql.js'

const allowed_fields = ['name','email','password','phone','avatar','currency','language']

export async function updateUserService(id,updates) {
  if (!id) throw new Error("ID required") ; 

  const user = await User.findById(id) ;

  if (!user) throw new Error("User not found") ;

  if(!Object.keys(updates).length) throw new Error("No fields provided");

  if (updates.password){
    updates.password = await bcrypt.hash(updates.password,10) ; 
  }
  
  // list of keys not in allowed_fields 
  const invalid = Object.keys(updates).filter(key => !allowed_fields.includes(key)) ; 

  if (invalid.length) throw new Error("Access forbidden"); 

  const result = await User.update(id,updates) ;
  return result  ;  
};
// NOTE - auth service already has change password I added this just as a fallback 


export async function deleteUserService (userId) {
  if (!userId) throw new Error("ID required") ; 
  
  const user = await User.findById(userId) ; 
  if (!user) throw new Error("User not found");

  try {
    const delete_user = await sql `
    DELETE 
      FROM users 
    WHERE 
      id = ${userId}
    RETURNING * 
  `;

    return delete_user[0] ; 
  } catch (error) {
    console.log("Error deleting tables : ", error) ; 
    throw new Error(error.message) ;
  }
  
}
