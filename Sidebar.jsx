import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Star, Settings, TrendingUp } from 'lucide-react';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: "Today's Ripe Fruit",
  },
  {
    name: 'Search',
    href: '/search',
    icon: Search,
    description: 'Player Search',
  },
  {
    name: 'Watchlist',
    href: '/watchlist',
    icon: Star,
    description: 'My Watchlist',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App Settings',
  },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border overflow-y-auto scrollbar-thin">
      <div className="p-6">
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-background'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`
              }
            >
              <item.icon size={20} className="mr-3" />
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Features Section */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-sm text-text-secondary">
                Real-time projections with confidence scoring
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Star size={16} className="text-primary" />
              <span className="text-sm text-text-secondary">
                Personalized watchlist tracking
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Search size={16} className="text-primary" />
              <span className="text-sm text-text-secondary">
                Advanced player search and analytics
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 card">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Today's Overview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">NBA Projections</span>
              <span className="text-primary font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">NFL Projections</span>
              <span className="text-primary font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">High Confidence</span>
              <span className="text-primary font-medium">23</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-secondary text-center">
            Free Fruit v1.0.0
          </p>
          <p className="text-xs text-text-secondary text-center mt-1">
            © 2024 Free Fruit Analytics
          </p>
        </div>
      </div>
    </aside>
  );
};