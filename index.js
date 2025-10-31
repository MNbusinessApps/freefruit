const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorHandler, notFoundHandler } = require('../middleware/errorHandler');
const fruitRoutes = require('./fruit');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'free-fruit-backend',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
router.use('/fruit', fruitRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Free Fruit Sports Intelligence API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      fruit: {
        today: '/api/fruit/today?sport=NBA|NFL',
        player: '/api/fruit/player/:id',
        search: '/api/fruit/search?q=player_name&sport=NBA'
      }
    }
  });
});

module.exports = router;