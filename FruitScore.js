import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';

const FruitScore = ({ score, size = 'medium', showLabel = true }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return theme.components.fruitScore.high.color;
    if (score >= 65) return theme.components.fruitScore.medium.color;
    if (score >= 50) return theme.components.fruitScore.low.color;
    return theme.colors.error;
  };

  const getScoreSize = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: theme.typography.fontSize.sm,
          containerSize: 40,
          padding: 8,
        };
      case 'large':
        return {
          fontSize: theme.typography.fontSize['2xl'],
          containerSize: 80,
          padding: 16,
        };
      default:
        return {
          fontSize: theme.typography.fontSize.lg,
          containerSize: 60,
          padding: 12,
        };
    }
  };

  const scoreColor = getScoreColor(score);
  const sizeConfig = getScoreSize();

  return (
    <View style={[styles.container, { padding: sizeConfig.padding }]}>
      <View
        style={[
          styles.scoreContainer,
          {
            width: sizeConfig.containerSize,
            height: sizeConfig.containerSize,
            backgroundColor: scoreColor,
          },
        ]}
      >
        <LinearGradient
          colors={[scoreColor, scoreColor + 'CC']}
          style={[
            styles.gradientContainer,
            {
              width: sizeConfig.containerSize - 4,
              height: sizeConfig.containerSize - 4,
            },
          ]}
        >
          <Text
            style={[
              styles.scoreText,
              {
                fontSize: sizeConfig.fontSize,
                color: '#000',
              },
            ]}
          >
            {Math.round(score)}
          </Text>
        </LinearGradient>
      </View>
      {showLabel && (
        <Text style={styles.labelText}>Fruit Score</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoreContainer: {
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  gradientContainer: {
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
    textAlign: 'center',
  },
  labelText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default FruitScore;