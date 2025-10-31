import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { format } from 'date-fns';

export const Header = ({ onMenuToggle }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCentralTime = (date) => {
    return format(date, 'h:mm:ss a');
  };

  const formatCentralDate = (date) => {
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-surface transition-colors lg:hidden"
          >
            <Menu size={20} className="text-text-primary" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-lg">🍎</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Free Fruit</h1>
              <p className="text-xs text-text-secondary">Sports Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Center: Central Time Clock */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-text-primary">
              {formatCentralTime(currentTime)}
            </span>
            <span className="text-sm text-text-secondary font-medium">CT</span>
          </div>
          <span className="text-xs text-text-secondary">
            {formatCentralDate(currentTime)}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-surface transition-colors">
            <Search size={20} className="text-text-primary" />
          </button>
          
          <button className="p-2 rounded-lg hover:bg-surface transition-colors relative">
            <Bell size={20} className="text-text-primary" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-text-primary">SA</span>
          </div>
        </div>
      </div>
    </header>
  );
};