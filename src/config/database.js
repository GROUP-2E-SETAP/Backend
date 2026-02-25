const mongoose = require('mongoose');
const { Pool } = require('pg');

// Import existing database configurations
const connectMongoDB = require('./mongoDb');
const connectPostgres = require('./psql');

module.exports = {
  connectMongoDB,
  connectPostgres
};
