import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { theme } from '../constants/theme';
import FruitScore from '../components/FruitScore';
import TopFruitList from '../components/TopFruitList';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fruitData, setFruitData] = useState({
    ripeFruit: [],
    totalProjections: 0,
    lastUpdated: null,
  });
  const [selectedSport, setSelectedSport] = useState('NBA');

  const fetchFruitData = async (sport = 'NBA') => {
    try {
      const API_BASE = 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE}/fruit/today?sport=${sport}`);
      const result = await response.json();
      
      if (result.success) {
        setFruitData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch fruit data:', error);
      // Fallback to demo data for development
      setFruitData({
        ripeFruit: [
          {
            player: { name: 'LeBron James', position: 'SF', team: 'LAL' },
            projection: 28.5,
            fruitScore: 94,
            statType: 'Points',
            trend: 'up',
          },
          {
            player: { name: 'Giannis Antetokounmpo', position: 'PF', team: 'MIL' },
            projection: 32.1,
            fruitScore: 91,
            statType: 'Points',
            trend: 'up',
          },
          {
            player: { name: 'Luka Dončić', position: 'PG', team: 'DAL' },
            projection: 31.2,
            fruitScore: 89,
            statType: 'Points',
            trend: 'stable',
          },
          {
            player: { name: 'Stephen Curry', position: 'PG', team: 'GSW' },
            projection: 26.8,
            fruitScore: 87,
            statType: 'Points',
            trend: 'up',
          },
          {
            player: { name: 'Jayson Tatum', position: 'PF', team: 'BOS' },
            projection: 29.4,
            fruitScore: 85,
            statType: 'Points',
            trend: 'up',
          },
        ],
        totalProjections: 156,
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFruitData(selectedSport);
  }, [selectedSport]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFruitData(selectedSport);
  };

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetail', { player });
  };

  const renderSportSelector = () => (
    <View style={styles.sportSelector}>
      <TouchableOpacity
        style={[
          styles.sportButton,
          selectedSport === 'NBA' && styles.sportButtonActive,
        ]}
        onPress={() => setSelectedSport('NBA')}
      >
        <Text
          style={[
            styles.sportButtonText,
            selectedSport === 'NBA' && styles.sportButtonTextActive,
          ]}
        >
          NBA
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sportButton,
          selectedSport === 'NFL' && styles.sportButtonActive,
        ]}
        onPress={() => setSelectedSport('NFL')}
      >
        <Text
          style={[
            styles.sportButtonText,
            selectedSport === 'NFL' && styles.sportButtonTextActive,
          ]}
        >
          NFL
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Fruit Intelligence...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Ripe Fruit</Text>
        <Text style={styles.headerSubtitle}>
          Top {fruitData.ripeFruit.length} most confident projections
        </Text>
      </View>

      {/* Sport Selector */}
      {renderSportSelector()}

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{fruitData.totalProjections}</Text>
          <Text style={styles.statLabel}>Total Projections</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {fruitData.ripeFruit.length}
          </Text>
          <Text style={styles.statLabel}>Ripe Fruit</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {fruitData.ripeFruit.length > 0
              ? Math.round(
                  fruitData.ripeFruit.reduce(
                    (sum, fruit) => sum + fruit.fruitScore,
                    0
                  ) / fruitData.ripeFruit.length
                )
              : 0}
          </Text>
          <Text style={styles.statLabel}>Avg Fruit Score</Text>
        </View>
      </View>

      {/* Last Updated */}
      {fruitData.lastUpdated && (
        <View style={styles.updateContainer}>
          <Text style={styles.updateText}>
            Last updated: {new Date(fruitData.lastUpdated).toLocaleTimeString()}
          </Text>
        </View>
      )}

      {/* Top Fruit List */}
      <TopFruitList
        fruits={fruitData.ripeFruit}
        onPlayerPress={handlePlayerPress}
      />

      {/* Bottom Spacing */}
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
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.normal,
  },
  sportSelector: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sportButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sportButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sportButtonText: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  sportButtonTextActive: {
    color: theme.colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.divider,
  },
  updateContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  updateText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

export default HomeScreen;