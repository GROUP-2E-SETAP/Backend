import { sql } from '../config/psql.js'

const errMessage = (operation) =>{
  return `Error ${operation} category data from database `;
}

export async function createCat(userId, catName,type) {
  try {
    const create = await sql `
    INSERT INTO  categories (user_id, name,type)
    VALUES (${userId},${catName},${type})
    RETURNING * 
  `;
    
    console.log(create[0]);

    return create[0] ;
  } catch (error) {
    console.error(errMessage("inserting"), error) ; 
    throw error ; 
  }
};

export async function getCat (userId) {
  try {
    const get = await sql ` 
    SELECT 
      id , name , type 
    FROM 
      categories 
    WHERE 
      user_id  = ${userId}
`;
    return get ; 
  } catch (error) {
    console.error(errMessage("selecting") ,error) ;
    throw error ; 
  }
}

export async function deleteCat (catId) {
  try {
    const delCategory = await sql `
    DELETE 
      FROM categories 
    WHERE 
       id = ${catId}
    RETURNING * 
`;
    
    const delTransaction = await sql`
    DELETE 
      FROM transactions 
    WHERE 
      category_id = ${catId}
    RETURNING * 
`;

    console.log(delCategory) ; 
    console.log(delTransaction) ;
    
    return delCategory[0] ; 

  } catch (error) {
    console.error(errMessage("deleting"),error);
    throw error ;  
  }
}
