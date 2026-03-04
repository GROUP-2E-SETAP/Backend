import { sql } from '../config/psql.js'

export async function createCat(userId, catName,type) {

  const create = await sql `
  INSERT INTO  categories (user_id, name,type)
  VALUES (${user_id},${catName},${type})
  RETURNING * 
`;

  if (create[0]) return true ; 
  return false ; 

};


export async function getCat (req,res) {

}
