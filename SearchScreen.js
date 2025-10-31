import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Search, Filter } from 'react-native-vector-icons/FontAwesome';
import { theme } from '../constants/theme';
import FruitScore from '../components/FruitScore';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState('NBA');
  const [selectedPosition, setSelectedPosition] = useState('ALL');

  const positions = {
    NBA: ['ALL', 'PG', 'SG', 'SF', 'PF', 'C'],
    NFL: ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'],
  };

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedSport, selectedPosition]);

  const performSearch = async () => {
    setLoading(true);
    
    try {
      // Mock search results for development
      const mockResults = [
        {
          id: '1',
          name: 'LeBron James',
          position: 'SF',
          team: 'LAL',
          sport: 'NBA',
          fruitScore: 94,
          latestProjection: { statType: 'Points', projection: 28.5 },
        },
        {
          id: '2',
          name: 'Giannis Antetokounmpo',
          position: 'PF',
          team: 'MIL',
          sport: 'NBA',
          fruitScore: 91,
          latestProjection: { statType: 'Points', projection: 32.1 },
        },
        {
          id: '3',
          name: 'Luka Dončić',
          position: 'PG',
          team: 'DAL',
          sport: 'NBA',
          fruitScore: 89,
          latestProjection: { statType: 'Points', projection: 31.2 },
        },
        {
          id: '4',
          name: 'Stephen Curry',
          position: 'PG',
          team: 'GSW',
          sport: 'NBA',
          fruitScore: 87,
          latestProjection: { statType: 'Points', projection: 26.8 },
        },
        {
          id: '5',
          name: 'Jayson Tatum',
          position: 'PF',
          team: 'BOS',
          sport: 'NBA',
          fruitScore: 85,
          latestProjection: { statType: 'Points', projection: 29.4 },
        },
      ];

      // Filter results based on search query and filters
      let filteredResults = mockResults.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        player.sport === selectedSport
      );

      if (selectedPosition !== 'ALL') {
        filteredResults = filteredResults.filter(player =>
          player.position === selectedPosition
        );
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetail', { player });
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlayerPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerMeta}>
          {item.position} • {item.team}
        </Text>
        {item.latestProjection && (
          <Text style={styles.projectionText}>
            {item.latestProjection.statType}: {item.latestProjection.projection}
          </Text>
        )}
      </View>
      <View style={styles.scoreContainer}>
        {item.fruitScore && (
          <FruitScore score={item.fruitScore} size="small" showLabel={false} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Search size={48} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>
        {searchQuery.length >= 2 ? 'No players found' : 'Start typing to search'}
      </Text>
      <Text style={styles.emptySubtext}>
        Search by player name
      </Text>
    </View>
  );

  const renderPositionFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedSport === 'NBA' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedSport('NBA')}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedSport === 'NBA' && styles.filterButtonTextActive,
          ]}
        >
          NBA
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedSport === 'NFL' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedSport('NFL')}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedSport === 'NFL' && styles.filterButtonTextActive,
          ]}
        >
          NFL
        </Text>
      </TouchableOpacity>
      
      {positions[selectedSport].map((position) => (
        <TouchableOpacity
          key={position}
          style={[
            styles.filterButton,
            selectedPosition === position && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedPosition(position)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedPosition === position && styles.filterButtonTextActive,
            ]}
          >
            {position}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filters */}
      {renderPositionFilter()}

      {/* Search Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContainer,
            searchResults.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchHeader: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  filterContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  filterContent: {
    paddingVertical: theme.spacing.xs,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  filterButtonTextActive: {
    color: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.base,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  playerMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  projectionText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen;