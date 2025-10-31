import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { 
  Home, 
  Search, 
  Star, 
  Settings, 
  User,
  TrendingUp,
} from 'react-native-vector-icons/FontAwesome';
import { theme } from '../constants/theme';

const CustomDrawerContent = (props) => {
  const { navigation, state } = props;

  const menuItems = [
    {
      name: 'Home',
      label: "Today's Ripe Fruit",
      icon: Home,
      screen: 'Home',
    },
    {
      name: 'Search',
      label: 'Player Search',
      icon: Search,
      screen: 'Search',
    },
    {
      name: 'Watchlist',
      label: 'My Watchlist',
      icon: Star,
      screen: 'Watchlist',
    },
    {
      name: 'Settings',
      label: 'Settings',
      icon: Settings,
      screen: 'Settings',
    },
  ];

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const isActive = (screen) => state.routeNames[state.index] === screen;

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.name}
      style={[
        styles.menuItem,
        isActive(item.screen) && styles.menuItemActive,
      ]}
      onPress={() => handleNavigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.iconContainer,
          isActive(item.screen) && styles.iconContainerActive,
        ]}>
          {React.cloneElement(item.icon, {
            size: 18,
            color: isActive(item.screen) 
              ? theme.colors.background 
              : theme.colors.primary,
          })}
        </View>
        <Text style={[
          styles.menuItemText,
          isActive(item.screen) && styles.menuItemTextActive,
        ]}>
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>🍎</Text>
          </View>
          <Text style={styles.appName}>Free Fruit</Text>
        </View>
        <Text style={styles.tagline}>
          Sports Intelligence Platform
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        {menuItems.map(renderMenuItem)}
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        <View style={styles.featureItem}>
          <TrendingUp size={16} color={theme.colors.primary} />
          <Text style={styles.featureText}>
            Real-time projections with confidence scoring
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Star size={16} color={theme.colors.primary} />
          <Text style={styles.featureText}>
            Personalized watchlist tracking
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Search size={16} color={theme.colors.primary} />
          <Text style={styles.featureText}>
            Advanced player search and analytics
          </Text>
        </View>
      </View>

      {/* User Section */}
      <View style={styles.userSection}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <User size={24} color={theme.colors.text} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Sports Analyst</Text>
            <Text style={styles.userRole}>Intelligence User</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.copyrightText}>
          © 2024 Free Fruit Analytics
        </Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  logoText: {
    fontSize: 20,
  },
  appName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  menuSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  menuItemActive: {
    backgroundColor: theme.colors.primary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  iconContainerActive: {
    backgroundColor: theme.colors.background + '30',
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  menuItemTextActive: {
    color: theme.colors.background,
  },
  featuresSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    flex: 1,
    lineHeight: 20,
  },
  userSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  userRole: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    alignItems: 'center',
  },
  versionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  copyrightText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default CustomDrawerContent;