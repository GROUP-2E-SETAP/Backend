import express from 'express' 
const router = express.Router() ; 

// /users
router.post('/:userId',updateUser) ;


export default router ;
