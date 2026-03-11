import express from 'express' 
import { updateUser } from '../../controllers/userControllers.js' 
const router = express.Router() ; 

// /users
router.patch('/:userId',updateUser) ;


export default router ;
