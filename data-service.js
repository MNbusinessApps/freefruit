const axios = require('axios');
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

class DataService {
  constructor() {
    this.apiKey = process.env.SPORTS_API_KEY;
    this.baseUrl = process.env.SPORTS_API_URL || 'https://api.sportsdata.io/v3';
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Fetch and update all NBA data
   */
  async updateNBAData() {
    logger.info('Starting NBA data update...');
    const startTime = Date.now();
    
    try {
      // Update teams
      await this.updateNBATeams();
      
      // Update players
      await this.updateNBAPlayers();
      
      // Update today's games
      await this.updateNBAGames();
      
      // Update player stats for recent games
      await this.updateNBAStats();
      
      const duration = Date.now() - startTime;
      logger.info(`✅ NBA data update completed in ${duration}ms`);
      
      return { success: true, duration, sport: 'NBA' };
      
    } catch (error) {
      logger.error('❌ NBA data update failed:', error);
      throw error;
    }
  }

  /**
   * Fetch and update all NFL data
   */
  async updateNFLData() {
    logger.info('Starting NFL data update...');
    const startTime = Date.now();
    
    try {
      // Update teams
      await this.updateNFLTeams();
      
      // Update players
      await this.updateNFLPlayers();
      
      // Update today's games
      await this.updateNFLGames();
      
      // Update player stats for recent games
      await this.updateNFLStats();
      
      const duration = Date.now() - startTime;
      logger.info(`✅ NFL data update completed in ${duration}ms`);
      
      return { success: true, duration, sport: 'NFL' };
      
    } catch (error) {
      logger.error('❌ NFL data update failed:', error);
      throw error;
    }
  }

  /**
   * Update NBA teams from API
   */
  async updateNBATeams() {
    try {
      const response = await this.makeAPICall('/nba/scoreboard/json/teams');
      
      for (const team of response) {
        await pool.query(`
          INSERT INTO teams (sport, team_id, name, city, abbreviation, conference, division, logo_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (team_id) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            city = EXCLUDED.city,
            abbreviation = EXCLUDED.abbreviation,
            conference = EXCLUDED.conference,
            division = EXCLUDED.division,
            logo_url = EXCLUDED.logo_url,
            updated_at = NOW()
        `, [
          'NBA',
          team.TeamID.toString(),
          team.Name,
          team.City,
          team.Key,
          team.Conference,
          team.Division,
          team.WikipediaLogoUrl
        ]);
      }
      
      logger.info(`Updated ${response.length} NBA teams`);
      
    } catch (error) {
      logger.error('Failed to update NBA teams:', error);
      throw error;
    }
  }

  /**
   * Update NBA players from API
   */
  async updateNBAPlayers() {
    try {
      const response = await this.makeAPICall('/nba/scoreboard/json/players');
      
      let updated = 0;
      for (const player of response) {
        if (!player.Active) continue; // Skip inactive players
        
        // Get team ID
        const teamResult = await pool.query('SELECT id FROM teams WHERE team_id = $1', [player.TeamID.toString()]);
        if (teamResult.rows.length === 0) continue;
        
        await pool.query(`
          INSERT INTO players (sport, player_id, first_name, last_name, position, jersey_number, height, weight, age, team_id, photo_url, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (player_id) 
          DO UPDATE SET 
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            position = EXCLUDED.position,
            jersey_number = EXCLUDED.jersey_number,
            height = EXCLUDED.height,
            weight = EXCLUDED.weight,
            age = EXCLUDED.age,
            team_id = EXCLUDED.team_id,
            photo_url = EXCLUDED.photo_url,
            status = EXCLUDED.status,
            updated_at = NOW()
        `, [
          'NBA',
          player.PlayerID.toString(),
          player.FirstName,
          player.LastName,
          player.Position,
          player.Jersey,
          player.Height,
          player.Weight,
          player.Age,
          teamResult.rows[0].id,
          player.PhotoUrl,
          player.Active ? 'active' : 'inactive'
        ]);
        
        updated++;
      }
      
      logger.info(`Updated ${updated} NBA players`);
      
    } catch (error) {
      logger.error('Failed to update NBA players:', error);
      throw error;
    }
  }

  /**
   * Update NBA games for today and next 7 days
   */
  async updateNBAGames() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const response = await this.makeAPICall(`/nba/scoreboard/json/gamesbydate/${today}`);
      
      let updated = 0;
      for (const game of response) {
        // Get home and away team IDs
        const homeTeamResult = await pool.query('SELECT id FROM teams WHERE team_id = $1', [game.HomeTeamID.toString()]);
        const awayTeamResult = await pool.query('SELECT id FROM teams WHERE team_id = $1', [game.AwayTeamID.toString()]);
        
        if (homeTeamResult.rows.length === 0 || awayTeamResult.rows.length === 0) continue;
        
        await pool.query(`
          INSERT INTO games (sport, game_id, season, game_date, home_team_id, away_team_id, status, venue)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (game_id) 
          DO UPDATE SET 
            game_date = EXCLUDED.game_date,
            home_score = EXCLUDED.home_score,
            away_score = EXCLUDED.away_score,
            status = EXCLUDED.status,
            venue = EXCLUDED.venue,
            updated_at = NOW()
        `, [
          'NBA',
          game.GameID.toString(),
          game.Season,
          game.DateTime.split('T')[0],
          homeTeamResult.rows[0].id,
          awayTeamResult.rows[0].id,
          this.mapGameStatus(game.Status),
          game.Venue
        ]);
        
        updated++;
      }
      
      logger.info(`Updated ${updated} NBA games`);
      
    } catch (error) {
      logger.error('Failed to update NBA games:', error);
      throw error;
    }
  }

  /**
   * Update NBA player stats for recent games
   */
  async updateNBAStats() {
    try {
      const today = new Date();
      for (let i = 0; i < 7; i++) { // Last 7 days
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const response = await this.makeAPICall(`/nba/scoreboard/json/gamesbydate/${dateStr}`);
          
          for (const game of response) {
            // Get game ID
            const gameResult = await pool.query('SELECT id FROM games WHERE game_id = $1', [game.GameID.toString()]);
            if (gameResult.rows.length === 0) continue;
            
            // Get player stats for this game
            const statsResponse = await this.makeAPICall(`/nba/scoreboard/json/player-game-stats-by-game/${game.GameID}`);
            
            for (const stat of statsResponse) {
              // Get player ID
              const playerResult = await pool.query('SELECT id FROM players WHERE player_id = $1', [stat.PlayerID.toString()]);
              if (playerResult.rows.length === 0) continue;
              
              await pool.query(`
                INSERT INTO player_stats (
                  player_id, game_id, sport, points, rebounds, assists, steals, blocks, turnovers,
                  field_goals_made, field_goals_attempted, three_points_made, three_points_attempted,
                  free_throws_made, free_throws_attempted, minutes_played
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                ON CONFLICT (player_id, game_id) 
                DO UPDATE SET 
                  points = EXCLUDED.points,
                  rebounds = EXCLUDED.rebounds,
                  assists = EXCLUDED.assists,
                  steals = EXCLUDED.steals,
                  blocks = EXCLUDED.blocks,
                  turnovers = EXCLUDED.turnovers,
                  field_goals_made = EXCLUDED.field_goals_made,
                  field_goals_attempted = EXCLUDED.field_goals_attempted,
                  three_points_made = EXCLUDED.three_points_made,
                  three_points_attempted = EXCLUDED.three_points_attempted,
                  free_throws_made = EXCLUDED.free_throws_made,
                  free_throws_attempted = EXCLUDED.free_throws_attempted,
                  minutes_played = EXCLUDED.minutes_played
              `, [
                playerResult.rows[0].id,
                gameResult.rows[0].id,
                'NBA',
                stat.Points || 0,
                stat.Rebounds || 0,
                stat.Assists || 0,
                stat.Steals || 0,
                stat.Blocks || 0,
                stat.Turnovers || 0,
                stat.FieldGoalsMade || 0,
                stat.FieldGoalsAttempted || 0,
                stat.ThreePointersMade || 0,
                stat.ThreePointersAttempted || 0,
                stat.FreeThrowsMade || 0,
                stat.FreeThrowsAttempted || 0,
                stat.Minutes || 0
              ]);
            }
          }
          
        } catch (gameError) {
          logger.warn(`Failed to update stats for ${dateStr}:`, gameError.message);
        }
      }
      
      logger.info('Updated NBA player stats for recent games');
      
    } catch (error) {
      logger.error('Failed to update NBA stats:', error);
      throw error;
    }
  }

  /**
   * NFL data methods (similar structure to NBA)
   */
  async updateNFLTeams() {
    try {
      const response = await this.makeAPICall('/nfl/scoreboard/json/teams');
      
      for (const team of response) {
        await pool.query(`
          INSERT INTO teams (sport, team_id, name, city, abbreviation, conference, division, logo_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (team_id) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            city = EXCLUDED.city,
            abbreviation = EXCLUDED.abbreviation,
            conference = EXCLUDED.conference,
            division = EXCLUDED.division,
            logo_url = EXCLUDED.logo_url,
            updated_at = NOW()
        `, [
          'NFL',
          team.TeamID.toString(),
          team.Name,
          team.City,
          team.Key,
          team.Conference,
          team.Division,
          team.WikipediaLogoUrl
        ]);
      }
      
      logger.info(`Updated ${response.length} NFL teams`);
      
    } catch (error) {
      logger.error('Failed to update NFL teams:', error);
      throw error;
    }
  }

  async updateNFLPlayers() {
    try {
      const response = await this.makeAPICall('/nfl/scoreboard/json/players');
      
      let updated = 0;
      for (const player of response) {
        if (!player.Active) continue;
        
        const teamResult = await pool.query('SELECT id FROM teams WHERE team_id = $1', [player.TeamID.toString()]);
        if (teamResult.rows.length === 0) continue;
        
        await pool.query(`
          INSERT INTO players (sport, player_id, first_name, last_name, position, jersey_number, height, weight, age, team_id, photo_url, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (player_id) 
          DO UPDATE SET 
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            position = EXCLUDED.position,
            jersey_number = EXCLUDED.jersey_number,
            height = EXCLUDED.height,
            weight = EXCLUDED.weight,
            age = EXCLUDED.age,
            team_id = EXCLUDED.team_id,
            photo_url = EXCLUDED.photo_url,
            status = EXCLUDED.status,
            updated_at = NOW()
        `, [
          'NFL',
          player.PlayerID.toString(),
          player.FirstName,
          player.LastName,
          player.Position,
          player.Jersey,
          player.Height,
          player.Weight,
          player.Age,
          teamResult.rows[0].id,
          player.PhotoUrl,
          player.Active ? 'active' : 'inactive'
        ]);
        
        updated++;
      }
      
      logger.info(`Updated ${updated} NFL players`);
      
    } catch (error) {
      logger.error('Failed to update NFL players:', error);
      throw error;
    }
  }

  async updateNFLGames() {
    try {
      const response = await this.makeAPICall('/nfl/scoreboard/json/games/2024/PST');
      
      let updated = 0;
      for (const game of response.slice(0, 20)) { // Limit to recent games
        const homeTeamResult = await pool.query('SELECT id FROM teams WHERE team_id = $1', [game.HomeTeamID.toString()]);
        const awayTeamResult = await pool.query('SELECT id FROM teams WHERE team_id = $1', [game.AwayTeamID.toString()]);
        
        if (homeTeamResult.rows.length === 0 || awayTeamResult.rows.length === 0) continue;
        
        await pool.query(`
          INSERT INTO games (sport, game_id, season, game_date, home_team_id, away_team_id, status, venue)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (game_id) 
          DO UPDATE SET 
            game_date = EXCLUDED.game_date,
            home_score = EXCLUDED.home_score,
            away_score = EXCLUDED.away_score,
            status = EXCLUDED.status,
            venue = EXCLUDED.venue,
            updated_at = NOW()
        `, [
          'NFL',
          game.GameID.toString(),
          game.Week,
          game.DateTime.split('T')[0],
          homeTeamResult.rows[0].id,
          awayTeamResult.rows[0].id,
          this.mapGameStatus(game.Status),
          game.Venue
        ]);
        
        updated++;
      }
      
      logger.info(`Updated ${updated} NFL games`);
      
    } catch (error) {
      logger.error('Failed to update NFL games:', error);
      throw error;
    }
  }

  async updateNFLStats() {
    // Similar implementation to NBA but with NFL stats
    logger.info('NFL stats update - placeholder for future implementation');
  }

  /**
   * Make API call with proper headers and error handling
   */
  async makeAPICall(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Accept': 'application/json'
        },
        timeout: this.timeout
      });
      
      return response.data;
      
    } catch (error) {
      if (error.response) {
        logger.error(`API Error ${error.response.status}:`, {
          url,
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        logger.error('API Request timeout:', { url });
      } else {
        logger.error('API Error:', error.message);
      }
      throw error;
    }
  }

  /**
   * Map API game status to our status enum
   */
  mapGameStatus(apiStatus) {
    const statusMap = {
      'Scheduled': 'scheduled',
      'InProgress': 'in_progress',
      'Final': 'completed',
      'Postponed': 'postponed',
      'Cancelled': 'cancelled'
    };
    
    return statusMap[apiStatus] || 'scheduled';
  }

  /**
   * Log refresh operation
   */
  async logRefresh(refreshType, sport, status, recordsProcessed, errorMessage = null) {
    try {
      await pool.query(`
        INSERT INTO refresh_logs (refresh_type, sport, status, records_processed, error_message, started_at, completed_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      `, [refreshType, sport, status, recordsProcessed, errorMessage]);
    } catch (error) {
      logger.error('Failed to log refresh operation:', error);
    }
  }
}

module.exports = new DataService();