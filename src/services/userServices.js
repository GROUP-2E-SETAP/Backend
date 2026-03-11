import bcrypt from 'bcrypejs'
import { User } from '../models/index.js'

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

  return updates ;  

} 
