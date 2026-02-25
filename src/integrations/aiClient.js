const axios = require('axios');
const config = require('../config');

/**
 * AI Client for integrating with AI services
 * Can be used for spending predictions, financial advice, etc.
 */
class AIClient {
  constructor() {
    this.apiKey = config.aiApiKey;
    this.baseUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
  }

  /**
   * Generate spending insights using AI
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async generateInsights(prompt) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error.message);
      throw new Error('Failed to generate insights');
    }
  }

  /**
   * Analyze spending patterns
   * @param {Array} transactions
   * @returns {Promise<Object>}
   */
  async analyzeSpendingPatterns(transactions) {
    const prompt = `Analyze these spending patterns and provide insights: ${JSON.stringify(transactions)}`;
    const analysis = await this.generateInsights(prompt);
    return { analysis };
  }

  /**
   * Get budget recommendations
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async getBudgetRecommendations(userData) {
    const prompt = `Based on this user data, suggest budget recommendations: ${JSON.stringify(userData)}`;
    const recommendations = await this.generateInsights(prompt);
    return { recommendations };
  }
}

module.exports = new AIClient();
