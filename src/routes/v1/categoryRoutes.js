import express from 'express' 
import {
  createCategory,
  getCategoryByUserId,
  deleteCategory
} from '../../controllers/categoryControllers.js'

const router = express.Router();

// /categories

router.post('/',createCategory) ; 

router.get('/:userId',getCategoryByUserId) ; 

router.delete('/',deleteCategory) ;

export default router ;
