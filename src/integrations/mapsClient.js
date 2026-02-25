const axios = require('axios');
const config = require('../config');

/**
 * Maps Client for location-based features
 */
class MapsClient {
  constructor() {
    this.apiKey = config.mapsApiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Geocode an address to coordinates
   * @param {string} address
   * @returns {Promise<Object>}
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: response.data.results[0].formatted_address
        };
      }

      throw new Error('Address not found');
    } catch (error) {
      console.error('Maps API Error:', error.message);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to address
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<string>}
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }

      throw new Error('Location not found');
    } catch (error) {
      console.error('Maps API Error:', error.message);
      throw new Error('Failed to reverse geocode location');
    }
  }

  /**
   * Find nearby places
   * @param {number} latitude
   * @param {number} longitude
   * @param {string} type
   * @param {number} radius
   * @returns {Promise<Array>}
   */
  async findNearbyPlaces(latitude, longitude, type = 'store', radius = 5000) {
    try {
      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        return response.data.results.map(place => ({
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          rating: place.rating,
          placeId: place.place_id
        }));
      }

      return [];
    } catch (error) {
      console.error('Maps API Error:', error.message);
      throw new Error('Failed to find nearby places');
    }
  }

  /**
   * Calculate distance between two points
   * @param {Object} origin
   * @param {Object} destination
   * @returns {Promise<Object>}
   */
  async calculateDistance(origin, destination) {
    try {
      const response = await axios.get(`${this.baseUrl}/distancematrix/json`, {
        params: {
          origins: `${origin.latitude},${origin.longitude}`,
          destinations: `${destination.latitude},${destination.longitude}`,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        const element = response.data.rows[0].elements[0];
        return {
          distance: element.distance.value, // in meters
          duration: element.duration.value, // in seconds
          distanceText: element.distance.text,
          durationText: element.duration.text
        };
      }

      throw new Error('Failed to calculate distance');
    } catch (error) {
      console.error('Maps API Error:', error.message);
      throw new Error('Failed to calculate distance');
    }
  }
}

module.exports = new MapsClient();
