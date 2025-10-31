const express = require('express');
const router = express.Router();
const projectionEngine = require('../services/projection-engine');
const dataService = require('../services/data-service');
const redis = require('../database/redis');

// GET /api/fruit/today?sport=NBA|NFL
router.get('/today', async (req, res, next) => {
  try {
    const { sport = 'NBA' } = req.query;
    const cacheKey = `fruit:today:${sport}`;
    
    // Check Redis cache first
    const cached = await redis.getCache(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    // Get today's games and projections
    const today = new Date().toISOString().split('T')[0];
    const games = await dataService.getTodaysGames(sport);
    const projections = await projectionEngine.calculateTodaysProjections(sport, today);
    
    // Sort by Fruit Score (confidence) descending
    const sortedProjections = projections.sort((a, b) => b.fruitScore - a.fruitScore);
    
    // Take top 10 "Today's Ripe Fruit"
    const ripeFruit = sortedProjections.slice(0, 10);
    
    const result = {
      date: today,
      sport,
      totalProjections: projections.length,
      ripeFruit,
      lastUpdated: new Date().toISOString()
    };

    // Cache for 1 hour
    await redis.setCache(cacheKey, result, 3600);
    
    res.json({
      success: true,
      data: result,
      cached: false
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/fruit/player/:id
router.get('/player/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sport = 'NBA' } = req.query;
    const cacheKey = `fruit:player:${id}:${sport}`;
    
    // Check Redis cache
    const cached = await redis.getCache(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    // Get player data and recent projections
    const player = await dataService.getPlayer(id);
    const recentStats = await dataService.getRecentStats(id, 5);
    const projections = await projectionEngine.getPlayerProjections(id, sport);
    const trend = projectionEngine.calculateTrend(recentStats);
    
    const result = {
      player,
      recentStats,
      projections,
      trend,
      fruitScore: projections.length > 0 ? projections[0].fruitScore : null,
      lastUpdated: new Date().toISOString()
    };

    // Cache for 30 minutes
    await redis.setCache(cacheKey, result, 1800);
    
    res.json({
      success: true,
      data: result,
      cached: false
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/fruit/search?q=player_name&sport=NBA
router.get('/search', async (req, res, next) => {
  try {
    const { q = '', sport = 'NBA' } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: {
          players: [],
          query: q,
          total: 0
        }
      });
    }

    const players = await dataService.searchPlayers(q, sport);
    
    // Get fruit scores for each player
    const playersWithScores = await Promise.all(
      players.map(async (player) => {
        const cacheKey = `fruit:player:${player.id}:${sport}`;
        const cached = await redis.getCache(cacheKey);
        
        if (cached && cached.projections && cached.projections.length > 0) {
          return {
            ...player,
            fruitScore: cached.fruitScore,
            latestProjection: cached.projections[0]
          };
        }
        
        return {
          ...player,
          fruitScore: null,
          latestProjection: null
        };
      })
    );

    // Sort by relevance and fruit score
    const sortedPlayers = playersWithScores.sort((a, b) => {
      if (a.fruitScore && b.fruitScore) {
        return b.fruitScore - a.fruitScore;
      }
      if (a.fruitScore && !b.fruitScore) return -1;
      if (!a.fruitScore && b.fruitScore) return 1;
      return 0;
    });

    res.json({
      success: true,
      data: {
        players: sortedPlayers,
        query: q,
        total: players.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;