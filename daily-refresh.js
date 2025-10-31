const cron = require('node-cron');
const dataService = require('../services/data-service');
const projectionEngine = require('../services/projection-engine');
const pool = require('../database/connection');
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

class DailyScheduler {
  constructor() {
    this.tasks = [];
    this.isRunning = false;
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }

    logger.info('🚀 Starting Free Fruit Daily Scheduler...');
    this.isRunning = true;

    // 6:00 AM CT - Full refresh (new day data)
    const morningTask = cron.schedule('0 6 * * *', async () => {
      await this.runFullRefresh('6:00 AM CT');
    }, {
      scheduled: false,
      timezone: 'America/Chicago'
    });

    // 12:00 PM CT - Midday update (injury updates, lineups)
    const middayTask = cron.schedule('0 12 * * *', async () => {
      await this.runMiddayUpdate('12:00 PM CT');
    }, {
      scheduled: false,
      timezone: 'America/Chicago'
    });

    // 5:00 PM CT - Pre-game finalization
    const eveningTask = cron.schedule('0 17 * * *', async () => {
      await this.runPreGameUpdate('5:00 PM CT');
    }, {
      scheduled: false,
      timezone: 'America/Chicago'
    });

    // Weekly cleanup - Sunday at 2 AM CT
    const weeklyCleanup = cron.schedule('0 2 * * 0', async () => {
      await this.runWeeklyCleanup('Sunday 2:00 AM CT');
    }, {
      scheduled: false,
      timezone: 'America/Chicago'
    });

    // Store task references
    this.tasks = [morningTask, middayTask, eveningTask, weeklyCleanup];

    // Start all tasks
    this.tasks.forEach(task => task.start());

    // Run initial refresh if it's during business hours
    this.runInitialRefresh();

    logger.info('✅ Daily Scheduler started successfully');
    logger.info('🕐 Scheduled jobs:');
    logger.info('   • 6:00 AM CT - Full Data Refresh');
    logger.info('   • 12:00 PM CT - Midday Updates');
    logger.info('   • 5:00 PM CT - Pre-Game Finalization');
    logger.info('   • Sunday 2:00 AM CT - Weekly Cleanup');
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    logger.info('🛑 Stopping Daily Scheduler...');
    
    this.tasks.forEach(task => {
      task.stop();
      task.destroy();
    });
    
    this.tasks = [];
    this.isRunning = false;
    logger.info('✅ Daily Scheduler stopped');
  }

  /**
   * Run initial refresh based on current time
   */
  async runInitialRefresh() {
    const now = new Date();
    const centralTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const hour = centralTime.getHours();

    logger.info(`🕐 Current Central Time: ${centralTime.toLocaleTimeString()}`);

    // If it's between 6 AM and 12 PM, run full refresh
    if (hour >= 6 && hour < 12) {
      logger.info('🌅 Running initial full refresh (morning window)');
      await this.runFullRefresh('Initial Morning Refresh');
    }
    // If it's between 12 PM and 5 PM, run midday update
    else if (hour >= 12 && hour < 17) {
      logger.info('🌤️ Running initial midday update');
      await this.runMiddayUpdate('Initial Midday Update');
    }
    // If it's between 5 PM and midnight, run pre-game update
    else if (hour >= 17) {
      logger.info('🌆 Running initial pre-game update');
      await this.runPreGameUpdate('Initial Pre-Game Update');
    }
    // Otherwise, wait for scheduled time
    else {
      logger.info('🌙 Outside business hours - waiting for scheduled refresh');
    }
  }

  /**
   * Full refresh at 6:00 AM CT
   * - Update all NBA/NFL data
   * - Calculate projections for today's games
   * - Generate daily "Ripe Fruit" rankings
   */
  async runFullRefresh(scheduleLabel) {
    const startTime = Date.now();
    logger.info(`🌅 Starting FULL REFRESH - ${scheduleLabel}`);

    try {
      // Log start
      await this.logJobStart('full_refresh', null);

      // Step 1: Update NBA data
      logger.info('📊 Updating NBA data...');
      const nbaResult = await dataService.updateNBAData();
      logger.info(`✅ NBA update completed: ${nbaResult.duration}ms`);

      // Step 2: Update NFL data  
      logger.info('🏈 Updating NFL data...');
      const nflResult = await dataService.updateNFLData();
      logger.info(`✅ NFL update completed: ${nflResult.duration}ms`);

      // Step 3: Calculate NBA projections
      logger.info('🧮 Calculating NBA projections...');
      const today = new Date().toISOString().split('T')[0];
      const nbaProjections = await projectionEngine.calculateDailyProjections('NBA', today);
      logger.info(`✅ NBA projections calculated: ${nbaProjections.length} players`);

      // Step 4: Calculate NFL projections
      logger.info('🧮 Calculating NFL projections...');
      const nflProjections = await projectionEngine.calculateDailyProjections('NFL', today);
      logger.info(`✅ NFL projections calculated: ${nflProjections.length} players`);

      // Step 5: Generate daily insights
      await this.generateDailyInsights(nbaProjections, nflProjections);

      const duration = Date.now() - startTime;
      await this.logJobComplete('full_refresh', null, 'success', 
        nbaProjections.length + nflProjections.length, duration);

      logger.info(`🎉 FULL REFRESH COMPLETED in ${duration}ms`);
      logger.info(`📈 Total projections: ${nbaProjections.length + nflProjections.length}`);

    } catch (error) {
      logger.error('❌ FULL REFRESH FAILED:', error);
      await this.logJobComplete('full_refresh', null, 'error', 0, Date.now() - startTime, error.message);
      throw error;
    }
  }

  /**
   * Midday update at 12:00 PM CT
   * - Update injuries and lineups
   * - Refresh projections with new information
   * - Update "Ripe Fruit" rankings
   */
  async runMiddayUpdate(scheduleLabel) {
    const startTime = Date.now();
    logger.info(`🌤️ Starting MIDDAY UPDATE - ${scheduleLabel}`);

    try {
      await this.logJobStart('midday_update', null);

      // Step 1: Update injury reports (simplified - would connect to injury API)
      logger.info('🏥 Updating injury reports...');
      await this.updateInjuryReports();

      // Step 2: Refresh NBA projections with injury adjustments
      const today = new Date().toISOString().split('T')[0];
      const nbaProjections = await projectionEngine.calculateDailyProjections('NBA', today);
      logger.info(`✅ NBA projections refreshed: ${nbaProjections.length} players`);

      // Step 3: Refresh NFL projections with injury adjustments
      const nflProjections = await projectionEngine.calculateDailyProjections('NFL', today);
      logger.info(`✅ NFL projections refreshed: ${nflProjections.length} players`);

      // Step 4: Update daily insights
      await this.generateDailyInsights(nbaProjections, nflProjections);

      const duration = Date.now() - startTime;
      await this.logJobComplete('midday_update', null, 'success',
        nbaProjections.length + nflProjections.length, duration);

      logger.info(`🌤️ MIDDAY UPDATE COMPLETED in ${duration}ms`);

    } catch (error) {
      logger.error('❌ MIDDAY UPDATE FAILED:', error);
      await this.logJobComplete('midday_update', null, 'error', 0, Date.now() - startTime, error.message);
    }
  }

  /**
   * Pre-game update at 5:00 PM CT
   * - Final projection adjustments
   * - Confirm starting lineups
   * - Generate final "Ripe Fruit" for the night
   */
  async runPreGameUpdate(scheduleLabel) {
    const startTime = Date.now();
    logger.info(`🌆 Starting PRE-GAME UPDATE - ${scheduleLabel}`);

    try {
      await this.logJobStart('pregame_update', null);

      // Step 1: Update starting lineups (simplified)
      logger.info('👥 Confirming starting lineups...');
      await this.updateStartingLineups();

      // Step 2: Final projection calculations
      const today = new Date().toISOString().split('T')[0];
      const nbaProjections = await projectionEngine.calculateDailyProjections('NBA', today);
      const nflProjections = await projectionEngine.calculateDailyProjections('NFL', today);

      // Step 3: Generate final daily insights
      await this.generateDailyInsights(nbaProjections, nflProjections, true);

      const duration = Date.now() - startTime;
      await this.logJobComplete('pregame_update', null, 'success',
        nbaProjections.length + nflProjections.length, duration);

      logger.info(`🌆 PRE-GAME UPDATE COMPLETED in ${duration}ms`);

    } catch (error) {
      logger.error('❌ PRE-GAME UPDATE FAILED:', error);
      await this.logJobComplete('pregame_update', null, 'error', 0, Date.now() - startTime, error.message);
    }
  }

  /**
   * Weekly cleanup - Sunday 2:00 AM CT
   * - Clean old logs
   * - Archive old projections
   * - Optimize database
   */
  async runWeeklyCleanup(scheduleLabel) {
    const startTime = Date.now();
    logger.info(`🧹 Starting WEEKLY CLEANUP - ${scheduleLabel}`);

    try {
      await this.logJobStart('weekly_cleanup', null);

      // Clean old refresh logs (keep last 30 days)
      await pool.query('DELETE FROM refresh_logs WHERE started_at < NOW() - INTERVAL \'30 days\'');

      // Clean old projections (keep last 14 days)
      await pool.query('DELETE FROM projections WHERE projection_date < NOW() - INTERVAL \'14 days\'');

      // Clean old player stats (keep last 30 days)
      await pool.query(`
        DELETE FROM player_stats ps 
        USING games g 
        WHERE ps.game_id = g.id 
        AND g.game_date < NOW() - INTERVAL \'30 days\'
      `);

      const duration = Date.now() - startTime;
      await this.logJobComplete('weekly_cleanup', null, 'success', 0, duration);

      logger.info(`🧹 WEEKLY CLEANUP COMPLETED in ${duration}ms`);

    } catch (error) {
      logger.error('❌ WEEKLY CLEANUP FAILED:', error);
      await this.logJobComplete('weekly_cleanup', null, 'error', 0, Date.now() - startTime, error.message);
    }
  }

  /**
   * Update injury reports (placeholder for real injury API integration)
   */
  async updateInjuryReports() {
    // This would integrate with a real injury API
    // For now, just log that we're checking
    logger.info('📋 Injury report check completed (placeholder)');
    
    // Simulate updating player injury statuses
    await pool.query(`
      UPDATE players 
      SET status = CASE 
        WHEN random() < 0.05 THEN 'injured'
        WHEN random() < 0.10 THEN 'questionable' 
        ELSE 'active'
      END
      WHERE status = 'active' AND random() < 0.15
    `);
  }

  /**
   * Update starting lineups (placeholder)
   */
  async updateStartingLineups() {
    logger.info('👥 Starting lineup check completed (placeholder)');
    
    // This would integrate with lineup APIs to confirm starters
  }

  /**
   * Generate daily insights and "Ripe Fruit" rankings
   */
  async generateDailyInsights(nbaProjections, nflProjections, isFinal = false) {
    try {
      // Combine all projections
      const allProjections = [...nbaProjections, ...nflProjections];
      
      // Sort by fruit score (confidence)
      const topFruit = allProjections
        .sort((a, b) => b.fruitScore - a.fruitScore)
        .slice(0, 20); // Top 20 most confident

      // Generate insights based on trends
      const insights = this.generateInsights(topFruit);

      logger.info(`🍎 Generated daily insights for ${topFruit.length} top players`);
      
      // Cache the insights
      await this.cacheDailyInsights(topFruit, insights, isFinal);
      
    } catch (error) {
      logger.error('Failed to generate daily insights:', error);
    }
  }

  /**
   * Generate intelligent insights from projections
   */
  generateInsights(topProjections) {
    const insights = {
      highConfidence: topProjections.filter(p => p.fruitScore >= 80).length,
      improving: topProjections.filter(p => p.trend.direction === 'improving').length,
      declining: topProjections.filter(p => p.trend.direction === 'declining').length,
      totalAnalyzed: topProjections.length
    };

    // Add some contextual insights
    if (insights.highConfidence > 10) {
      insights.summary = 'High confidence day with multiple strong plays available';
    } else if (insights.improving > insights.declining) {
      insights.summary = 'Market trending upward with several improving players';
    } else {
      insights.summary = 'Mixed signals today - proceed with caution';
    }

    return insights;
  }

  /**
   * Cache daily insights for mobile app
   */
  async cacheDailyInsights(topProjections, insights, isFinal = false) {
    try {
      const redis = require('../database/redis');
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `daily_insights:${today}`;
      
      const cacheData = {
        topFruit: topProjections.map(p => ({
          playerId: p.playerId,
          fruitScore: p.fruitScore,
          confidenceLevel: p.confidenceLevel,
          projections: p.projections,
          trend: p.trend,
          sport: p.sport
        })),
        insights,
        generatedAt: new Date().toISOString(),
        isFinal,
        centralTime: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
      };

      const ttl = isFinal ? 7200 : 3600; // 2 hours for final, 1 hour otherwise
      await redis.setex(cacheKey, ttl, JSON.stringify(cacheData));
      
      logger.info(`💾 Cached daily insights (TTL: ${ttl}s)`);
      
    } catch (error) {
      logger.error('Failed to cache daily insights:', error);
    }
  }

  /**
   * Log job start
   */
  async logJobStart(jobType, sport) {
    await pool.query(`
      INSERT INTO refresh_logs (refresh_type, sport, status, started_at)
      VALUES ($1, $2, 'running', NOW())
    `, [jobType, sport]);
  }

  /**
   * Log job completion
   */
  async logJobComplete(jobType, sport, status, recordsProcessed, duration, errorMessage = null) {
    await pool.query(`
      UPDATE refresh_logs 
      SET status = $1, 
          records_processed = $2, 
          error_message = $3,
          completed_at = NOW(),
          duration_ms = $4
      WHERE refresh_type = $5 AND sport = $6 AND status = 'running'
      ORDER BY started_at DESC
      LIMIT 1
    `, [status, recordsProcessed, errorMessage, duration, jobType, sport]);
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      tasksCount: this.tasks.length,
      currentTime: new Date().toISOString(),
      centralTime: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
    };
  }

  /**
   * Manual trigger for testing
   */
  async manualRefresh(type = 'full') {
    logger.info(`🔧 Manual trigger: ${type}`);
    
    switch (type) {
      case 'full':
        return await this.runFullRefresh('Manual Trigger');
      case 'midday':
        return await this.runMiddayUpdate('Manual Trigger');
      case 'pregame':
        return await this.runPreGameUpdate('Manual Trigger');
      default:
        throw new Error(`Unknown refresh type: ${type}`);
    }
  }
}

module.exports = new DailyScheduler();