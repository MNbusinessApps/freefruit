import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { theme } from '../constants/theme';
import FruitScore from './FruitScore';

const TopFruitList = ({ fruits, onPlayerPress }) => {
  const renderFruitItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.fruitItem}
      onPress={() => onPlayerPress(item.player)}
      activeOpacity={0.7}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>

      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{item.player.name}</Text>
        <Text style={styles.playerMeta}>
          {item.player.position} • {item.player.team}
        </Text>
        <Text style={styles.projectionText}>
          Projected {item.statType}: {item.projection}
        </Text>
        
        {/* Trend Indicator */}
        <View style={styles.trendContainer}>
          <View style={[
            styles.trendDot,
            { backgroundColor: getTrendColor(item.trend) }
          ]} />
          <Text style={styles.trendText}>
            {item.trend === 'up' ? 'Trending Up' : 
             item.trend === 'down' ? 'Trending Down' : 'Stable'}
          </Text>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <FruitScore score={item.fruitScore} size="small" showLabel={false} />
      </View>
    </TouchableOpacity>
  );

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return theme.colors.success;
      case 'down':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  if (!fruits || fruits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No ripe fruit available today</Text>
        <Text style={styles.emptySubtext}>
          Check back later for new projections
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Top Picks</Text>
        <Text style={styles.sectionSubtitle}>
          Ranked by confidence score
        </Text>
      </View>

      <FlatList
        data={fruits}
        renderItem={renderFruitItem}
        keyExtractor={(item, index) => `fruit-${index}`}
        ItemSeparatorComponent={renderSeparator}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    paddingBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  fruitItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rankText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  playerContainer: {
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
    marginBottom: theme.spacing.sm,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  trendText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  separator: {
    height: theme.spacing.sm,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default TopFruitList;