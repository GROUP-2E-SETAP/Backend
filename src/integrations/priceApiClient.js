const axios = require('axios');
const config = require('../config');

/**
 * Price API Client for price comparison functionality
 */
class PriceApiClient {
  constructor() {
    this.apiKey = config.priceApiKey;
    this.baseUrl = process.env.PRICE_API_URL || 'https://api.priceapi.com/v1';
  }

  /**
   * Search for product prices
   * @param {string} productName
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async searchProduct(productName, options = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/search`, {
        params: {
          q: productName,
          location: options.location,
          radius: options.radius || 5000
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Price API Error:', error.message);
      throw new Error('Failed to search for product prices');
    }
  }

  /**
   * Get product details by ID
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async getProductDetails(productId) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Price API Error:', error.message);
      throw new Error('Failed to get product details');
    }
  }

  /**
   * Compare prices across stores
   * @param {string} productName
   * @param {Array} storeIds
   * @returns {Promise<Object>}
   */
  async comparePrices(productName, storeIds) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/prices/compare`,
        {
          product: productName,
          stores: storeIds
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Price API Error:', error.message);
      throw new Error('Failed to compare prices');
    }
  }
}

module.exports = new PriceApiClient();
