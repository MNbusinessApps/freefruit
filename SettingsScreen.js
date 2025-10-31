import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  Bell, 
  Palette, 
  Globe, 
  Info, 
  Shield, 
  Star,
  ChevronRight,
} from 'react-native-vector-icons/FontAwesome';
import { theme } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedSport, setSelectedSport] = useState('NBA');

  const handleResetWatchlist = () => {
    Alert.alert(
      'Reset Watchlist',
      'This will remove all players from your watchlist. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Handle reset
            Alert.alert('Success', 'Watchlist has been reset');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and refresh the app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            // Handle cache clear
            Alert.alert('Success', 'Cache has been cleared');
          },
        },
      ]
    );
  };

  const renderSettingItem = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        {icon && (
          <View style={styles.iconContainer}>
            {React.cloneElement(icon, { 
              size: 20, 
              color: theme.colors.primary 
            })}
          </View>
        )}
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        onPress && <ChevronRight size={16} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const renderSwitchItem = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {icon && (
          <View style={styles.iconContainer}>
            {React.cloneElement(icon, { 
              size: 20, 
              color: theme.colors.primary 
            })}
          </View>
        )}
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
        thumbColor={value ? theme.colors.background : theme.colors.textSecondary}
      />
    </View>
  );

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Info */}
      {renderSection(
        'About',
        renderSettingItem({
          icon: <Info />,
          title: 'Free Fruit v1.0.0',
          subtitle: 'Sports Intelligence Platform',
        })
      )}

      {/* Notifications */}
      {renderSection(
        'Preferences',
        <>
          {renderSwitchItem({
            icon: <Bell />,
            title: 'Push Notifications',
            subtitle: 'Get notified about new projections',
            value: notifications,
            onValueChange: setNotifications,
          })}
          {renderSwitchItem({
            icon: <Globe />,
            title: 'Auto Refresh',
            subtitle: 'Automatically update data every 5 minutes',
            value: autoRefresh,
            onValueChange: setAutoRefresh,
          })}
          {renderSwitchItem({
            icon: <Palette />,
            title: 'Dark Mode',
            subtitle: 'Use dark theme (currently always on)',
            value: darkMode,
            onValueChange: setDarkMode,
          })}
        </>
      )}

      {/* Sports */}
      {renderSection(
        'Default Sport',
        <>
          <TouchableOpacity
            style={styles.sportSelector}
            onPress={() => setSelectedSport('NBA')}
          >
            <Text style={styles.sportOption}>Basketball (NBA)</Text>
            {selectedSport === 'NBA' && (
              <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sportSelector}
            onPress={() => setSelectedSport('NFL')}
          >
            <Text style={styles.sportOption}>Football (NFL)</Text>
            {selectedSport === 'NFL' && (
              <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </>
      )}

      {/* Data Management */}
      {renderSection(
        'Data Management',
        <>
          {renderSettingItem({
            icon: <Shield />,
            title: 'Reset Watchlist',
            subtitle: 'Remove all players from watchlist',
            onPress: handleResetWatchlist,
          })}
          {renderSettingItem({
            icon: <Bell />,
            title: 'Clear Cache',
            subtitle: 'Refresh all cached data',
            onPress: handleClearCache,
          })}
        </>
      )}

      {/* Legal */}
      {renderSection(
        'Legal & Support',
        <>
          {renderSettingItem({
            icon: <Info />,
            title: 'Terms of Service',
            subtitle: 'Read our terms and conditions',
          })}
          {renderSettingItem({
            icon: <Shield />,
            title: 'Privacy Policy',
            subtitle: 'How we handle your data',
          })}
          {renderSettingItem({
            icon: <Info />,
            title: 'About Free Fruit',
            subtitle: 'Learn more about our mission',
          })}
        </>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  sportSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  sportOption: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

export default SettingsScreen;