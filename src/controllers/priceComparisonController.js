const priceComparisonService = require('../services/priceComparisonService');
const { ApiError } = require('../utils/apiError');

exports.searchProduct = async (req, res, next) => {
  try {
    const { product, location } = req.query;
    
    if (!product) {
      throw new ApiError(400, 'Product name is required');
    }

    const results = await priceComparisonService.searchProduct(req.user.id, product, location);
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

exports.compareProducts = async (req, res, next) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new ApiError(400, 'Products array is required');
    }

    const comparison = await priceComparisonService.compareProducts(products);
    res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyStores = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;
    
    if (!latitude || !longitude) {
      throw new ApiError(400, 'Latitude and longitude are required');
    }

    const stores = await priceComparisonService.getNearbyStores(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(radius)
    );
    
    res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    next(error);
  }
};
