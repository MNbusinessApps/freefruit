import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Star, Trash2 } from 'react-native-vector-icons/FontAwesome';
import { theme } from '../constants/theme';
import FruitScore from '../components/FruitScore';

const WatchlistScreen = ({ navigation }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const savedWatchlist = await AsyncStorage.getItem('free_fruit_watchlist');
      if (savedWatchlist) {
        setWatchlistItems(JSON.parse(savedWatchlist));
      } else {
        // Set default watchlist items if none exist
        const defaultWatchlist = [
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
        ];
        setWatchlistItems(defaultWatchlist);
        await AsyncStorage.setItem('free_fruit_watchlist', JSON.stringify(defaultWatchlist));
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  };

  const saveWatchlist = async (items) => {
    try {
      await AsyncStorage.setItem('free_fruit_watchlist', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = (item) => {
    Alert.alert(
      'Remove from Watchlist',
      `Remove ${item.player.name} from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updatedList = watchlistItems.filter(watchlistItem => watchlistItem.id !== item.id);
            setWatchlistItems(updatedList);
            await saveWatchlist(updatedList);
          },
        },
      ]
    );
  };

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetail', { player });
  };

  const renderWatchlistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.watchlistItem}
      onPress={() => handlePlayerPress(item.player)}
      activeOpacity={0.7}
    >
      <View style={styles.playerInfo}>
        <View style={styles.playerHeader}>
          <Text style={styles.playerName}>{item.player.name}</Text>
          <Star
            size={20}
            color={theme.colors.primary}
            fill={theme.colors.primary}
          />
        </View>
        <Text style={styles.playerMeta}>
          {item.player.position} • {item.player.team}
        </Text>
        {item.latestProjection && (
          <Text style={styles.projectionText}>
            {item.latestProjection.statType}: {item.latestProjection.projection}
          </Text>
        )}
        <Text style={styles.addedDate}>
          Added {new Date(item.addedDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.itemActions}>
        <FruitScore score={item.fruitScore} size="small" showLabel={false} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromWatchlist(item)}
        >
          <Trash2 size={16} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Star size={48} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>Your watchlist is empty</Text>
      <Text style={styles.emptySubtext}>
        Add players to track their performance and projections
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.addButtonText}>Find Players</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={watchlistItems}
        renderItem={renderWatchlistItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContainer,
          watchlistItems.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
  },
  watchlistItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  playerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
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
    marginBottom: theme.spacing.xs,
  },
  addedDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  itemActions: {
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  removeButton: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  separator: {
    height: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.background,
  },
});

export default WatchlistScreen;