const pool = require('./connection');

const migrations = {
  // Create initial tables
  createTables: `
    -- Teams table
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      sport VARCHAR(10) NOT NULL CHECK (sport IN ('NBA', 'NFL')),
      team_id VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      abbreviation VARCHAR(10) NOT NULL,
      conference VARCHAR(20),
      division VARCHAR(20),
      logo_url VARCHAR(255),
      primary_color VARCHAR(7),
      secondary_color VARCHAR(7),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Players table
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      sport VARCHAR(10) NOT NULL CHECK (sport IN ('NBA', 'NFL')),
      player_id VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      full_name VARCHAR(100) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
      position VARCHAR(10) NOT NULL,
      jersey_number INTEGER,
      height VARCHAR(10),
      weight INTEGER,
      age INTEGER,
      experience INTEGER,
      team_id INTEGER REFERENCES teams(id),
      photo_url VARCHAR(255),
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'injured', 'out')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Games table
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      sport VARCHAR(10) NOT NULL CHECK (sport IN ('NBA', 'NFL')),
      game_id VARCHAR(50) UNIQUE NOT NULL,
      season VARCHAR(20) NOT NULL,
      game_date DATE NOT NULL,
      game_time TIME,
      home_team_id INTEGER REFERENCES teams(id),
      away_team_id INTEGER REFERENCES teams(id),
      home_score INTEGER,
      away_score INTEGER,
      status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled')),
      venue VARCHAR(100),
      attendance INTEGER,
      weather_conditions JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Player stats table (recent games)
    CREATE TABLE IF NOT EXISTS player_stats (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id),
      game_id INTEGER REFERENCES games(id),
      sport VARCHAR(10) NOT NULL,
      -- NBA stats
      points INTEGER DEFAULT 0,
      rebounds INTEGER DEFAULT 0,
      assists INTEGER DEFAULT 0,
      steals INTEGER DEFAULT 0,
      blocks INTEGER DEFAULT 0,
      turnovers INTEGER DEFAULT 0,
      field_goals_made INTEGER DEFAULT 0,
      field_goals_attempted INTEGER DEFAULT 0,
      three_points_made INTEGER DEFAULT 0,
      three_points_attempted INTEGER DEFAULT 0,
      free_throws_made INTEGER DEFAULT 0,
      free_throws_attempted INTEGER DEFAULT 0,
      minutes_played INTEGER DEFAULT 0,
      -- NFL stats
      passing_yards INTEGER DEFAULT 0,
      passing_touchdowns INTEGER DEFAULT 0,
      passing_interceptions INTEGER DEFAULT 0,
      rushing_yards INTEGER DEFAULT 0,
      rushing_touchdowns INTEGER DEFAULT 0,
      rushing_attempts INTEGER DEFAULT 0,
      receiving_yards INTEGER DEFAULT 0,
      receiving_touchdowns INTEGER DEFAULT 0,
      receptions INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(player_id, game_id)
    );

    -- Projections table (daily projections)
    CREATE TABLE IF NOT EXISTS projections (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id),
      game_id INTEGER REFERENCES games(id),
      sport VARCHAR(10) NOT NULL,
      projection_date DATE NOT NULL,
      -- Projected stats
      projected_points DECIMAL(5,1),
      projected_rebounds DECIMAL(4,1),
      projected_assists DECIMAL(4,1),
      projected_steals DECIMAL(4,1),
      projected_blocks DECIMAL(4,1),
      projected_turnovers DECIMAL(4,1),
      projected_passing_yards DECIMAL(6,1),
      projected_passing_touchdowns DECIMAL(4,1),
      projected_rushing_yards DECIMAL(6,1),
      projected_rushing_touchdowns DECIMAL(4,1),
      projected_receiving_yards DECIMAL(6,1),
      projected_receiving_touchdowns DECIMAL(4,1),
      projected_receptions DECIMAL(4,1),
      -- Confidence metrics
      fruit_score INTEGER CHECK (fruit_score >= 0 AND fruit_score <= 100),
      confidence_level VARCHAR(20) CHECK (confidence_level IN ('low', 'medium', 'high')),
      projection_method VARCHAR(50),
      last_updated TIMESTAMP DEFAULT NOW(),
      UNIQUE(player_id, game_id, projection_date)
    );

    -- Player trends table
    CREATE TABLE IF NOT EXISTS player_trends (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id),
      sport VARCHAR(10) NOT NULL,
      trend_date DATE NOT NULL,
      last_5_avg_points DECIMAL(5,2),
      last_5_avg_rebounds DECIMAL(4,2),
      last_5_avg_assists DECIMAL(4,2),
      last_3_avg_passing_yards DECIMAL(6,2),
      last_3_avg_rushing_yards DECIMAL(6,2),
      last_3_avg_receiving_yards DECIMAL(6,2),
      momentum_score INTEGER CHECK (momentum_score >= -100 AND momentum_score <= 100),
      trend_direction VARCHAR(10) CHECK (trend_direction IN ('improving', 'declining', 'stable')),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(player_id, trend_date)
    );

    -- Watchlist table (user favorites)
    CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id),
      added_date TIMESTAMP DEFAULT NOW(),
      notes TEXT,
      UNIQUE(player_id)
    );

    -- Data refresh logs
    CREATE TABLE IF NOT EXISTS refresh_logs (
      id SERIAL PRIMARY KEY,
      refresh_type VARCHAR(50) NOT NULL,
      sport VARCHAR(10),
      status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'partial')),
      records_processed INTEGER DEFAULT 0,
      error_message TEXT,
      started_at TIMESTAMP NOT NULL,
      completed_at TIMESTAMP,
      duration_ms INTEGER
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_players_sport ON players(sport);
    CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
    CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
    CREATE INDEX IF NOT EXISTS idx_games_sport_date ON games(sport, game_date);
    CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
    CREATE INDEX IF NOT EXISTS idx_stats_player_game ON player_stats(player_id, game_id);
    CREATE INDEX IF NOT EXISTS idx_projections_player_date ON projections(player_id, projection_date);
    CREATE INDEX IF NOT EXISTS idx_projections_sport_date ON projections(sport, projection_date);
    CREATE INDEX IF NOT EXISTS idx_trends_player_date ON player_trends(player_id, trend_date);
  `,
  
  // Add triggers for updated_at columns
  addTriggers: `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Add triggers to teams, players, and games tables
    DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
    CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_players_updated_at ON players;
    CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_games_updated_at ON games;
    CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `
};

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Running database migrations...');
    
    await client.query('BEGIN');
    
    // Run table creation
    await client.query(migrations.createTables);
    console.log('✅ Tables created successfully');
    
    // Run triggers
    await client.query(migrations.addTriggers);
    console.log('✅ Triggers created successfully');
    
    await client.query('COMMIT');
    console.log('🎉 Database migrations completed successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };