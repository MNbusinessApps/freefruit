import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, Target } from 'lucide-react';
import { FruitScore } from '../components/FruitScore';
import { PlayerCard } from '../components/PlayerCard';
import { StatsGrid } from '../components/StatsGrid';

const mockFruitData = {
  ripeFruit: [
    {
      id: '1',
      player: { name: 'LeBron James', position: 'SF', team: 'LAL', image: null },
      projection: 28.5,
      fruitScore: 94,
      statType: 'Points',
      trend: 'up',
      change: '+2.1',
    },
    {
      id: '2',
      player: { name: 'Giannis Antetokounmpo', position: 'PF', team: 'MIL', image: null },
      projection: 32.1,
      fruitScore: 91,
      statType: 'Points',
      trend: 'up',
      change: '+1.8',
    },
    {
      id: '3',
      player: { name: 'Luka Dončić', position: 'PG', team: 'DAL', image: null },
      projection: 31.2,
      fruitScore: 89,
      statType: 'Points',
      trend: 'stable',
      change: '+0.3',
    },
    {
      id: '4',
      player: { name: 'Stephen Curry', position: 'PG', team: 'GSW', image: null },
      projection: 26.8,
      fruitScore: 87,
      statType: 'Points',
      trend: 'up',
      change: '+1.5',
    },
    {
      id: '5',
      player: { name: 'Jayson Tatum', position: 'PF', team: 'BOS', image: null },
      projection: 29.4,
      fruitScore: 85,
      statType: 'Points',
      trend: 'up',
      change: '+2.3',
    },
  ],
  totalProjections: 156,
  averageFruitScore: 89,
  lastUpdated: new Date().toISOString(),
};

const HomePage = () => {
  const [fruitData, setFruitData] = useState(mockFruitData);
  const [selectedSport, setSelectedSport] = useState('NBA');
  const [loading, setLoading] = useState(false);

  const stats = [
    {
      title: 'Total Projections',
      value: fruitData.totalProjections,
      icon: Target,
      change: '+12',
      changeType: 'positive',
    },
    {
      title: 'Ripe Fruit',
      value: fruitData.ripeFruit.length,
      icon: TrendingUp,
      change: '+3',
      changeType: 'positive',
    },
    {
      title: 'Average Fruit Score',
      value: fruitData.averageFruitScore,
      icon: Clock,
      change: '+2.1',
      changeType: 'positive',
    },
    {
      title: 'Players Tracked',
      value: '450+',
      icon: Users,
      change: '+15',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Today's Ripe Fruit
          </h1>
          <p className="text-text-secondary mt-1">
            Top {fruitData.ripeFruit.length} most confident projections
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sport Selector */}
          <div className="flex bg-surface rounded-lg p-1 border border-border">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedSport === 'NBA'
                  ? 'bg-primary text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setSelectedSport('NBA')}
            >
              NBA
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedSport === 'NFL'
                  ? 'bg-primary text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setSelectedSport('NFL')}
            >
              NFL
            </button>
          </div>

          {/* Refresh Button */}
          <button
            className="btn-secondary"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              // Simulate refresh
              setTimeout(() => setLoading(false), 1000);
            }}
          >
            <Clock size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Last Updated */}
      <div className="flex items-center justify-between bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            Last updated: {new Date(fruitData.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <div className="text-sm text-text-secondary">
          Central Time: {new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' })}
        </div>
      </div>

      {/* Top Fruit Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Today's Top Picks
          </h2>
          <p className="text-text-secondary">
            Ranked by confidence score
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fruitData.ripeFruit.map((fruit, index) => (
            <PlayerCard
              key={fruit.id}
              player={fruit.player}
              projection={fruit.projection}
              fruitScore={fruit.fruitScore}
              statType={fruit.statType}
              trend={fruit.trend}
              change={fruit.change}
              rank={index + 1}
            />
          ))}
        </div>
      </div>

      {/* Empty State if no data */}
      {fruitData.ripeFruit.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No ripe fruit available today
          </h3>
          <p className="text-text-secondary">
            Check back later for new projections
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;