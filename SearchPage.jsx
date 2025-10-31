import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import { FruitScore } from '../components/FruitScore';

const mockPlayers = [
  { id: '1', name: 'LeBron James', position: 'SF', team: 'LAL', sport: 'NBA', fruitScore: 94, latestProjection: { statType: 'Points', projection: 28.5 } },
  { id: '2', name: 'Giannis Antetokounmpo', position: 'PF', team: 'MIL', sport: 'NBA', fruitScore: 91, latestProjection: { statType: 'Points', projection: 32.1 } },
  { id: '3', name: 'Luka Dončić', position: 'PG', team: 'DAL', sport: 'NBA', fruitScore: 89, latestProjection: { statType: 'Points', projection: 31.2 } },
  { id: '4', name: 'Stephen Curry', position: 'PG', team: 'GSW', sport: 'NBA', fruitScore: 87, latestProjection: { statType: 'Points', projection: 26.8 } },
  { id: '5', name: 'Jayson Tatum', position: 'PF', team: 'BOS', sport: 'NBA', fruitScore: 85, latestProjection: { statType: 'Points', projection: 29.4 } },
  { id: '6', name: 'Josh Allen', position: 'QB', team: 'BUF', sport: 'NFL', fruitScore: 92, latestProjection: { statType: 'Pass Yards', projection: 285.5 } },
  { id: '7', name: 'Patrick Mahomes', position: 'QB', team: 'KC', sport: 'NFL', fruitScore: 90, latestProjection: { statType: 'Pass Yards', projection: 295.2 } },
  { id: '8', name: 'Christian McCaffrey', position: 'RB', team: 'SF', sport: 'NFL', fruitScore: 88, latestProjection: { statType: 'Rush Yards', projection: 125.8 } },
];

const positions = {
  NBA: ['ALL', 'PG', 'SG', 'SF', 'PF', 'C'],
  NFL: ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'],
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('NBA');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    performSearch();
  }, [searchQuery, selectedSport, selectedPosition]);

  const performSearch = () => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let filtered = mockPlayers.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        player.sport === selectedSport
      );

      if (selectedPosition !== 'ALL') {
        filtered = filtered.filter(player => player.position === selectedPosition);
      }

      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Player Search</h1>
        <div className="text-text-secondary">
          Search and filter players across NBA and NFL
        </div>
      </div>

      <div className="card">
        {/* Search Input */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search players by name..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={performSearch}>
            <Search size={16} className="mr-2" />
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          <Filter size={16} className="text-text-secondary" />
          <span className="text-text-secondary text-sm">Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Sport Filter */}
          <div className="flex bg-surface rounded-lg p-1 border border-border">
            {['NBA', 'NFL'].map((sport) => (
              <button
                key={sport}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSport === sport
                    ? 'bg-primary text-background'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Position Filter */}
          <div className="flex bg-surface rounded-lg p-1 border border-border">
            {positions[selectedSport].map((position) => (
              <button
                key={position}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPosition === position
                    ? 'bg-primary text-background'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setSelectedPosition(position)}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Searching players...</p>
          </div>
        ) : searchQuery.length < 2 ? (
          <div className="text-center py-12">
            <Search size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Start typing to search players
            </h3>
            <p className="text-text-secondary">
              Find NBA and NFL players by name, team, or position
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No players found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search query or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Search Results ({searchResults.length})
              </h3>
              <div className="text-text-secondary text-sm">
                Updated <Clock size={14} className="inline mr-1" /> just now
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((player) => (
                <div key={player.id} className="bg-surface rounded-lg p-4 border border-border hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-text-primary font-semibold text-lg">{player.name}</h4>
                      <p className="text-text-secondary text-sm mb-2">
                        {player.position} • {player.team} • {player.sport}
                      </p>
                      {player.latestProjection && (
                        <p className="text-primary font-medium">
                          {player.latestProjection.statType}: {player.latestProjection.projection}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <FruitScore score={player.fruitScore} size="small" showLabel={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;