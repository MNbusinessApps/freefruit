import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import { FruitScore } from './FruitScore';

export const PlayerCard = ({
  player,
  projection,
  fruitScore,
  statType,
  trend,
  change,
  rank,
}) => {
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

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-text-secondary';
    }
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'text-green-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-text-secondary';
  };

  return (
    <Link to={`/player/${player.id}`} className="block group">
      <div className="card hover-lift group-hover:shadow-fruit transition-all duration-300">
        {/* Rank Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-background">
              {rank}
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(trend)}
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {change}
              </span>
            </div>
          </div>
          <FruitScore score={fruitScore} size="small" showLabel={false} />
        </div>

        {/* Player Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
            {player.name}
          </h3>
          <p className="text-text-secondary text-sm">
            {player.position} • {player.team}
          </p>
          
          {/* Projection */}
          <div className="pt-2 border-t border-border">
            <p className="text-primary font-medium text-base">
              {statType}: {projection}
            </p>
            <p className="text-text-secondary text-sm">
              Projected {statType.toLowerCase()}
            </p>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-text-secondary">
                Confidence: {fruitScore}%
              </span>
              <button className="p-1 text-text-secondary hover:text-primary transition-colors">
                <Star size={14} />
              </button>
            </div>
            <div className={`flex items-center space-x-1 text-xs ${getChangeColor(change)}`}>
              {getTrendIcon(trend)}
              <span>{trend === 'up' ? 'Trending' : trend === 'down' ? 'Declining' : 'Stable'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};