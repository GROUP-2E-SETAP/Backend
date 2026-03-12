import { describe, expect , test ,send ,beforeAll} from 'vitest' 
import request from 'supertest'
import app from '../src/app.js'

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
   console.log("Test sign up error : " , error ) ; 
  } finally { 
    userId = data.data.id ;
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

  test("should not allow updating without actually providing and ID ", async () => {
    const res = await request(app)
    .patch(`${API}`)
    .expect(404)
  })

  test("should update name and return success",async () => {
    const res = await request(app)
    .patch(`${API}/${userId}`)
    .send({name : "newTestName"})
    .expect(200)


    expect(res.body.data.name).toBe("newTestName") ;
  })

  test("should update multiple fields successfully ", async () => {
    const res = await request(app) 
    .patch(`${API}/${userId}`)
    .send({
        name : "newTestName2",
        email : "newTestEmail@gmail.com",
        currency : "£",
        language : "English"
      })
    .expect(200)

    expect(res.body.data.name).toBe("newTestName2");
    expect(res.body.data.email).toBe("newTestEmail@gmail.com");
    expect(res.body.data.currency).toBe("£");
    expect(res.body.data.language).toBe("English");
  })

  test("should not allow user to update forbidden fields like role",async () => {
    const res = await request(app)
    .patch(`${API}/${userId}`)
    .send({role : "admin"})
    .expect(403)
  })
})

describe(`DELETE ${API}/:userId -- deleting user will ` , ()=>{
  test("should reject request if user does not exist ", async () => {
    const res = request(app)
    .delete(`${API}/9999`)
    .expect(404)
  })

  test("should reject request if ID is not provided",async () => {
    const res = request(app)
    .delete(`${API}`)
    .expect(404)
  })

  test("should delete user created earlier and receive a status code 200", async () => {
    const res = await request(app)
    .delete(`${API}/${userId}`) 
    .expect(200)
  })
})


