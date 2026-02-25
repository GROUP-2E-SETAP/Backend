const Category = require('../models/Category');
const { ApiError } = require('../utils/apiError');

exports.createCategory = async (userId, categoryData) => {
  const category = await Category.create({
    user: userId,
    ...categoryData
  });
  return category;
};

exports.getUserCategories = async (userId, filters = {}) => {
  const query = { user: userId };
  
  if (filters.type) {
    query.type = filters.type;
  }

  const categories = await Category.find(query).sort({ createdAt: -1 });
  return categories;
};

exports.getCategoryById = async (categoryId, userId) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });
  
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  
  return category;
};

exports.updateCategory = async (categoryId, userId, updateData) => {
  const category = await Category.findOneAndUpdate(
    { _id: categoryId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  
  return category;
};

exports.deleteCategory = async (categoryId, userId) => {
  const category = await Category.findOneAndDelete({ _id: categoryId, user: userId });
  
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  
  // TODO: Handle transactions associated with this category
  
  return category;
};
