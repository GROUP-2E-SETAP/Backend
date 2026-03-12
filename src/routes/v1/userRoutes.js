import express from 'express' 
import { updateUser, deleteUser } from '../../controllers/userControllers.js' 
const router = express.Router() ; 

// /users
router.patch('/:userId',updateUser) ;
router.delete('/:userId',deleteUser) ;

export default router ;
