import React from 'react';

export const FruitScore = ({ score, size = 'medium', showLabel = true }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-fruit-high';
    if (score >= 65) return 'text-fruit-medium';
    if (score >= 50) return 'text-fruit-low';
    return 'text-red-400';
  };

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg',
  };

  const gradientClasses = {
    small: 'from-fruit-high to-primary',
    medium: 'from-fruit-high to-primary',
    large: 'from-fruit-high to-primary',
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full 
          bg-gradient-to-br 
          ${gradientClasses[size]}
          flex items-center justify-center 
          font-bold
          shadow-lg
          animate-fade-in
        `}
        style={{
          boxShadow: '0 4px 14px 0 rgba(28, 229, 200, 0.3)',
        }}
      >
        <span className="text-background">
          {Math.round(score)}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs text-text-secondary mt-1 font-medium">
          Fruit Score
        </span>
      )}
    </div>
  );
};