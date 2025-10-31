import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlayerDetailScreen from './src/screens/PlayerDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Components
import CustomDrawerContent from './src/components/CustomDrawerContent';
import CentralTimeClock from './src/components/CentralTimeClock';

// Theme
import { theme } from './src/constants/theme';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitle: () => <CentralTimeClock />,
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: 280,
        },
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerInactiveBackgroundColor: 'transparent',
        drawerActiveTintColor: theme.colors.surface,
        drawerInactiveTintColor: theme.colors.text,
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: "Today's Ripe Fruit" }}
      />
      <Drawer.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: "Player Search" }}
      />
      <Drawer.Screen 
        name="Watchlist" 
        component={WatchlistScreen}
        options={{ title: "My Watchlist" }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="light" backgroundColor={theme.colors.primary} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen 
              name="PlayerDetail" 
              component={PlayerDetailScreen}
              options={{
                headerShown: true,
                title: 'Player Details',
                headerStyle: {
                  backgroundColor: theme.colors.background,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTintColor: theme.colors.text,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}