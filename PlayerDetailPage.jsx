import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { FruitScore } from '../components/FruitScore';

const mockPlayerData = {
  '1': {
    id: '1',
    name: 'LeBron James',
    position: 'SF',
    team: 'LAL',
    sport: 'NBA',
    fruitScore: 94,
    recentStats: [
      { game: 'vs LAL', points: 31, assists: 8, rebounds: 6, date: '2024-01-15' },
      { game: '@ BOS', points: 28, assists: 12, rebounds: 4, date: '2024-01-12' },
      { game: 'vs MIA', points: 35, assists: 6, rebounds: 9, date: '2024-01-10' },
      { game: '@ NYK', points: 29, assists: 10, rebounds: 5, date: '2024-01-08' },
      { game: 'vs PHI', points: 33, assists: 7, rebounds: 7, date: '2024-01-05' },
    ],
    projections: [
      { statType: 'Points', projection: 28.5, fruitScore: 94 },
      { statType: 'Assists', projection: 8.2, fruitScore: 87 },
      { statType: 'Rebounds', projection: 6.8, fruitScore: 82 },
    ],
    analysis: "LeBron continues to defy age with elite production. The Lakers offense runs through him, and his usage rate remains among the league's highest. Favorable matchup against a weak defensive team tonight.",
  },
  '2': {
    id: '2',
    name: 'Giannis Antetokounmpo',
    position: 'PF',
    team: 'MIL',
    sport: 'NBA',
    fruitScore: 91,
    recentStats: [
      { game: 'vs TOR', points: 33, assists: 4, rebounds: 12, date: '2024-01-15' },
      { game: '@ MIA', points: 29, assists: 6, rebounds: 14, date: '2024-01-12' },
      { game: 'vs CHA', points: 37, assists: 3, rebounds: 11, date: '2024-01-10' },
      { game: '@ IND', points: 31, assists: 5, rebounds: 13, date: '2024-01-08' },
      { game: 'vs DET', points: 28, assists: 7, rebounds: 15, date: '2024-01-05' },
    ],
    projections: [
      { statType: 'Points', projection: 32.1, fruitScore: 91 },
      { statType: 'Rebounds', projection: 12.8, fruitScore: 89 },
      { statType: 'Assists', projection: 5.4, fruitScore: 76 },
    ],
    analysis: "Giannis is in peak form, dominating both ends of the court. The Bucks' offense is running through him, and he has a size advantage against tonight's opponent.",
  },
};

const PlayerDetailPage = () => {
  const { id } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const player = mockPlayerData[id] || mockPlayerData['1'];
      setPlayerData(player);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatHeader = () => (
    <div className="flex justify-around py-3 border-b border-border">
      <span className="text-text-secondary text-sm font-medium">GAME</span>
      <span className="text-text-secondary text-sm font-medium">PTS</span>
      <span className="text-text-secondary text-sm font-medium">AST</span>
      <span className="text-text-secondary text-sm font-medium">REB</span>
      <span className="text-text-secondary text-sm font-medium">DATE</span>
    </div>
  );

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Minus size={16} className="text-text-secondary" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Loading player data...</span>
        </div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">Player Not Found</h1>
        <div className="card">
          <p className="text-text-secondary">The requested player could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{playerData.name}</h1>
            <p className="text-text-secondary text-lg">
              {playerData.position} • {playerData.team} • {playerData.sport}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <FruitScore score={playerData.fruitScore} size="large" showLabel={true} />
            <button
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className={`p-3 rounded-lg transition-colors ${
                isWatchlisted
                  ? 'bg-primary text-background'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <Star size={20} className={isWatchlisted ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {playerData.projections[0]?.projection || 'N/A'}
            </p>
            <p className="text-text-secondary text-sm">
              {playerData.projections[0]?.statType || 'Projection'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {Math.round(
                playerData.recentStats.reduce((sum, stat) => sum + stat.points, 0) /
                  playerData.recentStats.length
              )}
            </p>
            <p className="text-text-secondary text-sm">Avg PPG (5)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {playerData.recentStats[0]?.game || 'N/A'}
            </p>
            <p className="text-text-secondary text-sm">Last Game</p>
          </div>
        </div>
      </div>

      {/* Today's Projections */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Tonight's Projections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playerData.projections.map((projection, index) => (
            <div key={index} className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-primary font-semibold">{projection.statType}</h3>
                <FruitScore score={projection.fruitScore} size="small" showLabel={false} />
              </div>
              <p className="text-2xl font-bold text-primary mb-1">
                {projection.projection}
              </p>
              <p className="text-text-secondary text-sm">
                Projected {projection.statType.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Performance */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Performance</h2>
        <div className="bg-surface rounded-lg border border-border">
          {getStatHeader()}
          <div className="divide-y divide-border">
            {playerData.recentStats.map((stat, index) => (
              <div key={index} className="flex justify-around py-3">
                <span className="text-text-primary font-medium">{stat.game}</span>
                <span className="text-text-primary font-medium">{stat.points}</span>
                <span className="text-text-primary font-medium">{stat.assists}</span>
                <span className="text-text-primary font-medium">{stat.rebounds}</span>
                <span className="text-text-secondary">{new Date(stat.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Analysis</h2>
        </div>
        <p className="text-text-primary leading-relaxed">{playerData.analysis}</p>
        
        <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-lg border border-primary border-opacity-20">
          <div className="flex items-center space-x-2 mb-2">
            {getTrendIcon('up')}
            <span className="text-primary font-semibold">Confidence Assessment</span>
          </div>
          <p className="text-text-primary">
            Based on recent form, matchup analysis, and historical performance, 
            this projection carries a <strong>{playerData.fruitScore}% confidence level</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;