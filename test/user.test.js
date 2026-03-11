import { describe, expect , test , beforeAll} from 'vitest' 
import request from 'supertest'
import app from '../src/app.js'

// const allowed_fields = ['name','email','password','phone','avatar','currency','language']
//
// export async function updateUserService(id,updates) {
//   if (!id) throw new Error("ID required") ; 
//
//   const user = await User.findById(id) ;
//
//   if (!user) throw new Error("User not found") ;
//
//   if(!Object.keys(updates).length) throw new Error("No fields provided");
//
//   if (updates.password){
//     updates.password = await bcrypt.hash(updates.password,10) ; 
//   }
//
//   // list of keys not in allowed_fields 
//   const invalid = Object.keys(updates).filter(key => !allowed_fields.includes(key)) ; 
//
//   if (invalid.length) throw new Error("Access forbidden"); 
//
//   return updates ;  
//
// }
// for reference  

const API = '/api/v1/users' ; 

// for testing 
let userId ; 
let data ;
const mockSignup = async () => {
  const signUpData = {
    name : "test1" , 
    email : "testmail@gmail.com",
    password : "testPassword123!"
  }

  try {
     const res = await fetch("http://localhost:3000/api/v1/auth/signup",{
      method : "POST" ,
      headers : {"Content-Type" : "application/json"} ,
      body : JSON.stringify(signUpData) 
    }) ; 
    
    data = await res.json() ; 
    
  } catch (error) {
   console.log("Test sign up erro : " , error ) ; 
  } finally {
    userId = data.data.id ; 
    console.log(data);
    console.log(userId) ; 
  }
}

beforeAll(async () => {
  await mockSignup() 
})

describe(`PATCH ${API}/:userId -- updating user info `,()=>{
  test("should not allow updating a user that doesn't exist ",async () => {
    const res = await request(app)
    .patch(`${API}/99999`)
    .expect(404)
  })
})





//
// bad req = 400 
// unauth 
// forbidden 
// notfound 
//
//
// server Error =500 
