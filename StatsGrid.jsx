import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsGrid = ({ stats }) => {
  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? (
      <TrendingUp size={16} className="text-green-400" />
    ) : (
      <TrendingDown size={16} className="text-red-400" />
    );
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <stat.icon size={20} className="text-primary" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor(stat.changeType)}`}>
              {getChangeIcon(stat.changeType)}
              <span>{stat.change}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">
              {stat.value}
            </h3>
            <p className="text-text-secondary text-sm">
              {stat.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};