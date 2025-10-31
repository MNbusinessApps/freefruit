const pool = require('../database/connection');
const redis = require('../database/redis');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

class ProjectionEngine {
  constructor() {
    this.initialized = false;
    this.weights = {
      nba: {
        points: [0.40, 0.30, 0.20, 0.07, 0.03],
        rebounds: [0.40, 0.30, 0.20, 0.07, 0.03],
        assists: [0.40, 0.30, 0.20, 0.07, 0.03]
      },
      nfl: {
        passing_yards: [0.50, 0.30, 0.20], // Last 3 games
        rushing_yards: [0.50, 0.30, 0.20],
        receiving_yards: [0.50, 0.30, 0.20]
      }
    };
    
    this.contextFactors = {
      homeAdvantage: 0.03, // 3% boost for home games
      restDays: {
        poor: 0.0,      // 0-1 days rest
        average: 0.02,  // 2 days rest  
        good: 0.05      // 3+ days rest
      },
      injuryStatus: {
        active: 1.0,
        limited: 0.85,
        questionable: 0.70,
        out: 0.0
      }
    };
  }

  async initialize() {
    logger.info('Initializing Projection Engine...');
    this.initialized = true;
    logger.info('Projection Engine initialized successfully');
  }

  /**
   * Calculate projection for a single player
   * MIT-style weighted average with contextual adjustments
   */
  async calculatePlayerProjection(playerId, gameDate, sport) {
    try {
      // Get player recent stats
      const recentStats = await this.getRecentStats(playerId, sport);
      if (!recentStats.length) {
        throw new Error(`No recent stats found for player ${playerId}`);
      }

      // Get contextual factors
      const context = await this.getPlayerContext(playerId, gameDate);
      
      // Calculate base projections using weighted averages
      const baseProjections = this.calculateBaseProjections(recentStats, sport, this.weights[sport.toLowerCase()]);
      
      // Apply contextual adjustments
      const adjustedProjections = this.applyContextualAdjustments(baseProjections, context);
      
      // Calculate confidence (Fruit Score)
      const fruitScore = this.calculateFruitScore(recentStats, adjustedProjections);
      
      // Generate trend analysis
      const trend = this.calculateTrend(recentStats, sport);
      
      return {
        playerId,
        sport,
        projectionDate: gameDate,
        projections: adjustedProjections,
        fruitScore,
        confidenceLevel: this.getConfidenceLevel(fruitScore),
        trend,
        projectionMethod: 'weighted_avg_contextual',
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`Error calculating projection for player ${playerId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate projections for all active players for today's games
   */
  async calculateDailyProjections(sport, gameDate = null) {
    const date = gameDate || new Date().toISOString().split('T')[0];
    logger.info(`Calculating daily projections for ${sport} on ${date}`);

    try {
      // Get all players with games today
      const playersWithGames = await this.getPlayersWithGamesToday(sport, date);
      logger.info(`Found ${playersWithGames.length} players with games today`);

      const projections = [];
      const batchSize = 50; // Process in batches to avoid memory issues

      for (let i = 0; i < playersWithGames.length; i += batchSize) {
        const batch = playersWithGames.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (player) => {
          try {
            return await this.calculatePlayerProjection(player.id, date, sport);
          } catch (error) {
            logger.error(`Failed to calculate projection for player ${player.id}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        projections.push(...batchResults.filter(p => p !== null));
        
        logger.info(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(playersWithGames.length/batchSize)}`);
      }

      // Store projections in database and cache
      await this.storeProjections(projections);
      await this.cacheProjections(sport, date, projections);
      
      logger.info(`✅ Successfully calculated ${projections.length} projections for ${sport}`);
      return projections;

    } catch (error) {
      logger.error(`Failed to calculate daily projections for ${sport}:`, error);
      throw error;
    }
  }

  /**
   * Get recent stats for a player (last 5 NBA / last 3 NFL)
   */
  async getRecentStats(playerId, sport) {
    const limit = sport === 'NBA' ? 5 : 3;
    
    const query = `
      SELECT ps.*, g.game_date, g.home_team_id, g.away_team_id, g.status as game_status
      FROM player_stats ps
      JOIN games g ON ps.game_id = g.id
      WHERE ps.player_id = $1 AND ps.sport = $2
      ORDER BY g.game_date DESC
      LIMIT $3
    `;
    
    const result = await pool.query(query, [playerId, sport, limit]);
    return result.rows;
  }

  /**
   * Get contextual factors for a player
   */
  async getPlayerContext(playerId, gameDate) {
    const query = `
      SELECT 
        p.status as injury_status,
        p.position,
        t.name as team_name,
        g.home_team_id,
        g.away_team_id,
        t.id as team_id,
        CASE WHEN g.home_team_id = t.id THEN 'home' ELSE 'away' END as home_away,
        g.game_date,
        g.venue
      FROM players p
      JOIN teams t ON p.team_id = t.id
      JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id)
      WHERE p.id = $1 AND g.game_date = $2
      LIMIT 1
    `;
    
    const result = await pool.query(query, [playerId, gameDate]);
    const context = result.rows[0] || {};

    // Calculate rest days (simplified - last game)
    const restQuery = `
      SELECT game_date 
      FROM player_stats ps
      JOIN games g ON ps.game_id = g.id
      WHERE ps.player_id = $1 AND g.game_date < $2
      ORDER BY g.game_date DESC
      LIMIT 1
    `;
    
    const restResult = await pool.query(restQuery, [playerId, gameDate]);
    let restDays = 3; // Default to good rest
    
    if (restResult.rows.length > 0) {
      const lastGameDate = new Date(restResult.rows[0].game_date);
      const currentGameDate = new Date(gameDate);
      restDays = Math.floor((currentGameDate - lastGameDate) / (1000 * 60 * 60 * 24));
    }

    return {
      ...context,
      restDays,
      isHomeGame: context.home_away === 'home'
    };
  }

  /**
   * Calculate base projections using MIT-style weighted averages
   */
  calculateBaseProjections(recentStats, sport, weights) {
    const projections = {};
    
    if (sport === 'NBA') {
      const stats = ['points', 'rebounds', 'assists'];
      
      stats.forEach(stat => {
        const values = recentStats.map(game => parseFloat(game[stat] || 0));
        const weightedSum = values.reduce((sum, value, index) => {
          const weight = weights[stat][index] || 0.1;
          return sum + (value * weight);
        }, 0);
        
        projections[`projected_${stat}`] = Math.round(weightedSum * 10) / 10;
      });
      
    } else if (sport === 'NFL') {
      const stats = ['passing_yards', 'rushing_yards', 'receiving_yards'];
      
      stats.forEach(stat => {
        const values = recentStats.map(game => parseFloat(game[stat] || 0));
        const weightedSum = values.reduce((sum, value, index) => {
          const weight = weights[stat][index] || 0.33;
          return sum + (value * weight);
        }, 0);
        
        projections[`projected_${stat}`] = Math.round(weightedSum);
      });
    }
    
    return projections;
  }

  /**
   * Apply contextual adjustments (home field, rest, injuries)
   */
  applyContextualAdjustments(baseProjections, context) {
    const adjusted = { ...baseProjections };
    
    // Home field advantage
    if (context.isHomeGame) {
      Object.keys(adjusted).forEach(key => {
        adjusted[key] = adjusted[key] * (1 + this.contextFactors.homeAdvantage);
      });
    }
    
    // Rest days adjustment
    let restMultiplier = this.contextFactors.restDays.average;
    if (context.restDays <= 1) {
      restMultiplier = this.contextFactors.restDays.poor;
    } else if (context.restDays >= 3) {
      restMultiplier = this.contextFactors.restDays.good;
    }
    
    Object.keys(adjusted).forEach(key => {
      adjusted[key] = adjusted[key] * (1 + restMultiplier);
    });
    
    // Injury status adjustment
    const injuryMultiplier = this.contextFactors.injuryStatus[context.injury_status] || 1.0;
    Object.keys(adjusted).forEach(key => {
      adjusted[key] = adjusted[key] * injuryMultiplier;
    });
    
    // Round to appropriate precision
    Object.keys(adjusted).forEach(key => {
      if (key.includes('yards')) {
        adjusted[key] = Math.round(adjusted[key]);
      } else {
        adjusted[key] = Math.round(adjusted[key] * 10) / 10;
      }
    });
    
    return adjusted;
  }

  /**
   * Calculate Fruit Score (confidence level 0-100)
   * Based on volatility and consistency of recent performance
   */
  calculateFruitScore(recentStats, projections) {
    if (!recentStats.length) return 50;
    
    // Calculate volatility for main stat
    const mainStats = recentStats.map(stat => parseFloat(stat.points || stat.passing_yards || stat.rushing_yards || 0));
    const mean = mainStats.reduce((sum, val) => sum + val, 0) / mainStats.length;
    const variance = mainStats.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / mainStats.length;
    const volatility = Math.sqrt(variance);
    
    // Base confidence on low volatility
    let baseConfidence = Math.max(50, 100 - (volatility / mean * 100));
    
    // Adjust for number of games (more games = higher confidence)
    const sampleSizeBonus = (recentStats.length / 5) * 10; // Max 10 point bonus
    baseConfidence += sampleSizeBonus;
    
    // Adjust for projection reasonableness
    const projectedValue = Object.values(projections)[0] || 0;
    if (projectedValue > 0 && mean > 0) {
      const deviation = Math.abs(projectedValue - mean) / mean;
      baseConfidence -= deviation * 20; // Penalty for unrealistic projections
    }
    
    return Math.max(45, Math.min(95, Math.round(baseConfidence)));
  }

  /**
   * Determine confidence level from Fruit Score
   */
  getConfidenceLevel(fruitScore) {
    if (fruitScore >= 80) return 'high';
    if (fruitScore >= 70) return 'medium';
    return 'low';
  }

  /**
   * Calculate performance trend (improving/declining/stable)
   */
  calculateTrend(recentStats, sport) {
    if (recentStats.length < 2) {
      return { direction: 'stable', momentumScore: 0 };
    }
    
    const mainStat = sport === 'NBA' ? 'points' : 'passing_yards';
    const recent = recentStats.slice(0, 3); // Last 3 games
    const older = recentStats.slice(3, 5);  // Previous 2 games
    
    const recentAvg = recent.reduce((sum, game) => sum + (parseFloat(game[mainStat] || 0)), 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, game) => sum + (parseFloat(game[mainStat] || 0)), 0) / older.length : recentAvg;
    
    const change = recentAvg - olderAvg;
    const percentChange = olderAvg > 0 ? (change / olderAvg) * 100 : 0;
    
    let direction = 'stable';
    if (percentChange > 10) direction = 'improving';
    else if (percentChange < -10) direction = 'declining';
    
    const momentumScore = Math.round(Math.max(-100, Math.min(100, percentChange)));
    
    return { direction, momentumScore };
  }

  /**
   * Get players with games today
   */
  async getPlayersWithGamesToday(sport, date) {
    const query = `
      SELECT DISTINCT p.id, p.first_name, p.last_name, p.position, t.name as team_name
      FROM players p
      JOIN teams t ON p.team_id = t.id
      JOIN games g ON (g.home_team_id = t.id OR g.away_team_id = t.id)
      WHERE p.sport = $1 
        AND g.game_date = $2 
        AND g.status = 'scheduled'
        AND p.status = 'active'
      ORDER BY p.last_name, p.first_name
    `;
    
    const result = await pool.query(query, [sport, date]);
    return result.rows;
  }

  /**
   * Store projections in database
   */
  async storeProjections(projections) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const projection of projections) {
        const {
          playerId, sport, projectionDate, projections: stats,
          fruitScore, confidenceLevel, trend, projectionMethod
        } = projection;
        
        const query = `
          INSERT INTO projections (
            player_id, sport, projection_date, 
            projected_points, projected_rebounds, projected_assists,
            projected_passing_yards, projected_rushing_yards, projected_receiving_yards,
            fruit_score, confidence_level, projection_method, last_updated
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
          ON CONFLICT (player_id, game_id, projection_date) 
          DO UPDATE SET
            projected_points = EXCLUDED.projected_points,
            projected_rebounds = EXCLUDED.projected_rebounds,
            projected_assists = EXCLUDED.projected_assists,
            projected_passing_yards = EXCLUDED.projected_passing_yards,
            projected_rushing_yards = EXCLUDED.projected_rushing_yards,
            projected_receiving_yards = EXCLUDED.projected_receiving_yards,
            fruit_score = EXCLUDED.fruit_score,
            confidence_level = EXCLUDED.confidence_level,
            projection_method = EXCLUDED.projection_method,
            last_updated = NOW()
        `;
        
        await client.query(query, [
          playerId, sport, projectionDate,
          stats.projected_points || null,
          stats.projected_rebounds || null,
          stats.projected_assists || null,
          stats.projected_passing_yards || null,
          stats.projected_rushing_yards || null,
          stats.projected_receiving_yards || null,
          fruitScore, confidenceLevel, projectionMethod
        ]);
      }
      
      await client.query('COMMIT');
      logger.info(`Stored ${projections.length} projections in database`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to store projections:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Cache projections in Redis for fast access
   */
  async cacheProjections(sport, date, projections) {
    try {
      const cacheKey = `projections:${sport}:${date}`;
      const cacheData = {
        projections: projections.map(p => ({
          playerId: p.playerId,
          projections: p.projections,
          fruitScore: p.fruitScore,
          confidenceLevel: p.confidenceLevel,
          trend: p.trend
        })),
        cachedAt: new Date().toISOString(),
        total: projections.length
      };
      
      await redis.setex(cacheKey, 3600, JSON.stringify(cacheData)); // 1 hour TTL
      logger.info(`Cached ${projections.length} projections for ${sport} on ${date}`);
      
    } catch (error) {
      logger.error('Failed to cache projections:', error);
    }
  }
}

module.exports = new ProjectionEngine();