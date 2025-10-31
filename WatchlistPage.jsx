import React, { useState } from 'react';
import { Star, Trash2, TrendingUp } from 'lucide-react';
import { FruitScore } from '../components/FruitScore';

const mockWatchlist = [
  {
    id: '1',
    player: { name: 'LeBron James', position: 'SF', team: 'LAL' },
    fruitScore: 94,
    latestProjection: { statType: 'Points', projection: 28.5 },
    addedDate: '2024-01-15',
  },
  {
    id: '2',
    player: { name: 'Giannis Antetokounmpo', position: 'PF', team: 'MIL' },
    fruitScore: 91,
    latestProjection: { statType: 'Points', projection: 32.1 },
    addedDate: '2024-01-14',
  },
  {
    id: '3',
    player: { name: 'Luka Dončić', position: 'PG', team: 'DAL' },
    fruitScore: 89,
    latestProjection: { statType: 'Points', projection: 31.2 },
    addedDate: '2024-01-13',
  },
  {
    id: '4',
    player: 'Josh Allen',
    playerInfo: { position: 'QB', team: 'BUF' },
    fruitScore: 92,
    latestProjection: { statType: 'Pass Yards', projection: 285.5 },
    addedDate: '2024-01-12',
  },
];

const WatchlistPage = () => {
  const [watchlistItems, setWatchlistItems] = useState(mockWatchlist);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'score', 'date'

  const handleRemoveItem = (itemId) => {
    setWatchlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const sortedItems = [...watchlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.fruitScore - a.fruitScore;
      case 'date':
        return new Date(b.addedDate) - new Date(a.addedDate);
      default:
        const nameA = typeof a.player === 'string' ? a.player : a.player.name;
        const nameB = typeof b.player === 'string' ? b.player : b.player.name;
        return nameA.localeCompare(nameB);
    }
  });

  const getPlayerName = (item) => {
    return typeof item.player === 'string' ? item.player : item.player.name;
  };

  const getPlayerInfo = (item) => {
    return typeof item.player === 'string' ? item.playerInfo : item.player;
  };

  if (watchlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary">My Watchlist</h1>
          <div className="text-text-secondary">
            Track your favorite players
          </div>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <Star size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-text-secondary">
              Add players to track their performance and projections
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">My Watchlist</h1>
        <div className="flex items-center space-x-4">
          <span className="text-text-secondary">Sort by:</span>
          <select
            className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="score">Fruit Score (High-Low)</option>
            <option value="date">Date Added (Newest)</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Star className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Players</p>
              <p className="text-2xl font-bold text-text-primary">{watchlistItems.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Avg Fruit Score</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.round(watchlistItems.reduce((sum, item) => sum + item.fruitScore, 0) / watchlistItems.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
              <Star className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">High Confidence</p>
              <p className="text-2xl font-bold text-text-primary">
                {watchlistItems.filter(item => item.fruitScore >= 90).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="card">
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div key={item.id} className="bg-surface rounded-lg p-4 border border-border hover:border-primary transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Star className="text-primary" size={20} />
                    <h3 className="text-text-primary font-semibold text-lg">
                      {getPlayerName(item)}
                    </h3>
                  </div>
                  
                  <p className="text-text-secondary text-sm mb-2">
                    {getPlayerInfo(item).position} • {getPlayerInfo(item).team}
                  </p>
                  
                  {item.latestProjection && (
                    <p className="text-primary font-medium">
                      {item.latestProjection.statType}: {item.latestProjection.projection}
                    </p>
                  )}
                  
                  <p className="text-text-secondary text-xs mt-2">
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <FruitScore score={item.fruitScore} size="small" showLabel={true} />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;