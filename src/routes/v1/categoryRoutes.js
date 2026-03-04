import express from 'express' 

const router = express.Router();

// /categories

router.post('/',createCategory) ; 

router.get('/:userId',getCategoryByUserId) ; 

router.delete('/',deleteCategory) ;

export default router ;
