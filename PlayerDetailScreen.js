import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Star } from 'react-native-vector-icons/FontAwesome';
import { theme } from '../constants/theme';
import FruitScore from '../components/FruitScore';

const { width } = Dimensions.get('window');

const PlayerDetailScreen = ({ route, navigation }) => {
  const { player } = route.params;
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      // In a real app, fetch from API
      // For now, use mock data
      setTimeout(() => {
        setPlayerData({
          ...player,
          recentStats: [
            { game: 'vs LAL', points: 31, assists: 8, rebounds: 6, date: '2024-01-15' },
            { game: '@ BOS', points: 28, assists: 12, rebounds: 4, date: '2024-01-12' },
            { game: 'vs MIA', points: 35, assists: 6, rebounds: 9, date: '2024-01-10' },
            { game: '@ NYK', points: 29, assists: 10, rebounds: 5, date: '2024-01-08' },
            { game: 'vs PHI', points: 33, assists: 7, rebounds: 7, date: '2024-01-05' },
          ],
          projections: [
            { statType: 'Points', projection: 28.5, fruitScore: 94 },
            { statType: 'Assists', projection: 8.2, fruitScore: 87 },
            { statType: 'Rebounds', projection: 6.8, fruitScore: 82 },
          ],
        });
        checkIfWatchlisted();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch player data:', error);
      setLoading(false);
    }
  };

  const checkIfWatchlisted = async () => {
    try {
      const savedWatchlist = await AsyncStorage.getItem('free_fruit_watchlist');
      if (savedWatchlist) {
        const watchlist = JSON.parse(savedWatchlist);
        const isInWatchlist = watchlist.some(item => item.player.name === player.name);
        setIsWatchlisted(isInWatchlist);
      }
    } catch (error) {
      console.error('Failed to check watchlist status:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      const savedWatchlist = await AsyncStorage.getItem('free_fruit_watchlist');
      let watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];

      if (isWatchlisted) {
        // Remove from watchlist
        watchlist = watchlist.filter(item => item.player.name !== player.name);
        setIsWatchlisted(false);
        Alert.alert('Removed', `${player.name} has been removed from your watchlist.`);
      } else {
        // Add to watchlist
        const newWatchlistItem = {
          id: Date.now().toString(),
          player: {
            name: player.name,
            position: player.position || 'N/A',
            team: player.team || 'N/A',
          },
          fruitScore: playerData.fruitScore || 85,
          latestProjection: playerData.projections?.[0] || { statType: 'Points', projection: 'N/A' },
          addedDate: new Date().toISOString().split('T')[0],
        };
        watchlist.push(newWatchlistItem);
        setIsWatchlisted(true);
        Alert.alert('Added', `${player.name} has been added to your watchlist.`);
      }

      await AsyncStorage.setItem('free_fruit_watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Failed to update watchlist:', error);
      Alert.alert('Error', 'Failed to update watchlist. Please try again.');
    }
  };

  const renderStatRow = (stat, index) => (
    <View key={index} style={styles.statRow}>
      <Text style={styles.statGame}>{stat.game}</Text>
      <View style={styles.statValues}>
        <Text style={styles.statValue}>{stat.points}</Text>
        <Text style={styles.statValue}>{stat.assists}</Text>
        <Text style={styles.statValue}>{stat.rebounds}</Text>
      </View>
      <Text style={styles.statDate}>{new Date(stat.date).toLocaleDateString()}</Text>
    </View>
  );

  const renderProjection = (projection, index) => (
    <View key={index} style={styles.projectionCard}>
      <View style={styles.projectionHeader}>
        <Text style={styles.projectionType}>{projection.statType}</Text>
        <FruitScore score={projection.fruitScore} size="small" showLabel={false} />
      </View>
      <Text style={styles.projectionValue}>{projection.projection}</Text>
      <Text style={styles.projectionLabel}>Projected {projection.statType.toLowerCase()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading player data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Player Header */}
      <View style={styles.playerHeader}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{playerData.name}</Text>
          <Text style={styles.playerMeta}>
            {playerData.position} • {playerData.team}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <FruitScore score={88} size="large" showLabel={true} />
          <TouchableOpacity
            style={[
              styles.watchlistButton,
              isWatchlisted && styles.watchlistButtonActive,
            ]}
            onPress={toggleWatchlist}
          >
            <Star
              size={20}
              color={isWatchlisted ? theme.colors.background : theme.colors.primary}
              fill={isWatchlisted ? theme.colors.background : 'transparent'}
            />
            <Text
              style={[
                styles.watchlistButtonText,
                isWatchlisted && styles.watchlistButtonTextActive,
              ]}
            >
              {isWatchlisted ? 'Watching' : 'Watch'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>28.5</Text>
          <Text style={styles.quickStatLabel}>Avg Points</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>8.2</Text>
          <Text style={styles.quickStatLabel}>Avg Assists</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatValue}>6.8</Text>
          <Text style={styles.quickStatLabel}>Avg Rebounds</Text>
        </View>
      </View>

      {/* Recent Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Performance</Text>
        <View style={styles.statsTable}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsHeaderText}>Game</Text>
            <Text style={styles.statsHeaderText}>PTS</Text>
            <Text style={styles.statsHeaderText}>AST</Text>
            <Text style={styles.statsHeaderText}>REB</Text>
            <Text style={styles.statsHeaderText}>Date</Text>
          </View>
          {playerData.recentStats.map((stat, index) => renderStatRow(stat, index))}
        </View>
      </View>

      {/* Projections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Projections</Text>
        <View style={styles.projectionsGrid}>
          {playerData.projections.map((projection, index) => 
            renderProjection(projection, index)
          )}
        </View>
      </View>

      {/* Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analysis</Text>
        <View style={styles.analysisCard}>
          <Text style={styles.analysisText}>
            Based on recent performance trends and contextual factors, this player 
            shows strong consistency with a high confidence score. The projection 
            algorithm factors in opponent defensive ranking, home/away advantage, 
            and rest days.
          </Text>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.base,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  playerMeta: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  quickStatLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsTable: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  statsHeader: {
    flexDirection: 'row',
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  statsHeaderText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  statGame: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  statValues: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  statDate: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  projectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  projectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: (width - 3 * theme.spacing.lg) / 2,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  projectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  projectionType: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  projectionValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  projectionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  analysisCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  analysisText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  watchlistButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  watchlistButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  watchlistButtonTextActive: {
    color: theme.colors.background,
  },
});

export default PlayerDetailScreen;