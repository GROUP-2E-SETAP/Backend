import { sql } from "../config/psql";

const errMessage = (operation, error) => {
  return `Error ${operation} goals data: ${error?.message ?? error}`;
}


export async function createG(userId,goalName,targetAmount,deadline) {
  try {
    const create = await sql`
    INSERT 
      INTO 
        goals(user_id,name,target,deadline) 
      
    VALUES(${userId},${goalName},${targetAmount},${deadline})

    RETURNING * ;
`;
    console.log(create[0]); 
    
    return create[0];
  } catch (error) {
    console.error(errMessage("creating",error));
    throw error ; 
  }
}


export async function updateG(goalId,newAmount) {
  try {

    const update = await sql`
    UPDATE goals 
    SET current = ${newAmount}
    WHERE id = ${goalId} 
    RETURNING *; 
`;
    return update[0];

  } catch (error) {
    console.error(errMessage("updating",error));
    throw error ;
  }
}


export async function delG(goalId) {
  try {
    const del = await sql`
    DELETE FROM goals 
    WHERE id = ${goalId}
    RETURNING * ;
`;
    console.log(del[0]);
    return del[0];

  } catch (error) {
   console.error(errMessage("deleting",error));
   throw error ; 
  }
}
