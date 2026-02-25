const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const { protect } = require('../../middleware/auth');
const { validateCategory } = require('../../middleware/validation');

router.use(protect);

router
  .route('/')
  .get(categoryController.getCategories)
  .post(validateCategory, categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategoryById)
  .put(validateCategory, categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
