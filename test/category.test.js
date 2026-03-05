import config from '../src/config/index.js'
import request from 'supertest'
import app from '../src/app.js' 
import { describe, expect , test } from 'vitest'
// by far category got 3 operations - Create Read & Delete 

const API = `/api/v1/categories`;
let categoryId ; // would be used later for delete 

// creating a category 
describe(`POST ${API}`, () => {
  test("should create a category for user with ID 1 ",async () => {
    const res = await request(app)
      .post(API)
      .expect('Content-Type',/json/)
      .send({
        userId : "1",
        catName : "Movie",
        type : "expense"
      }) 
      .expect(200);
     
    categoryId = res.body.data.id ;
    
    expect(res.body.success).toBe(true);
  })
});


// fetching categories by user id 

describe(`GET ${API}/1`, () => {
  test("Should return all categories created by user with ID : 1 ", async () => {
    const res = await request(app)
      .get(`${API}/1`)
      .expect(200);

    expect(res.body.success).toBe(true);  
  })
})


// deleting category created during first test 

describe(`DELETE ${API}`, () => {
  test("Should delete the category created during earlier test ", async () => {
    const res = await request(app)
      .delete(API)
      .expect('Content-Type',/json/)
      .send({ catId : categoryId})
      .expect(200);

    expect(res.body.success).toBe(true);
  })
})

// NOTE : delete test fails without transaction logic as deleting a category would delete all 
// transactions relating to that cateogry  
