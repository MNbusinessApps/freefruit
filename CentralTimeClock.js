import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { theme } from '../constants/theme';

const CentralTimeClock = () => {
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
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatCentralTime(currentTime)}
        </Text>
        <Text style={styles.timezoneText}>CT</Text>
      </View>
      <Text style={styles.dateText}>
        {formatCentralDate(currentTime)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  timeText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  timezoneText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginLeft: 6,
    marginTop: 2,
  },
  dateText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },
});

export default CentralTimeClock;