import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {DownloadsScreen} from '../screens/DownloadsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {
  DownloadIcon,
  HomeIcon,
  ProfileIcon,
  SearchIcon,
} from '../components/icons';
import {colors} from '../theme/colors';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Downloads: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({focused, color}) => {
          const size = 24;
          const c = focused ? colors.brand : color;
          switch (route.name) {
            case 'Home':
              return <HomeIcon size={size} color={c} />;
            case 'Search':
              return <SearchIcon size={size} color={c} />;
            case 'Downloads':
              return <DownloadIcon size={size} color={c} />;
            case 'Profile':
              return <ProfileIcon size={size} color={c} />;
          }
          return null;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Downloads" component={DownloadsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10,10,10,0.95)',
    borderTopColor: colors.glassBorder,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.select({ios: 84, android: 64}),
    paddingTop: 8,
    paddingBottom: Platform.select({ios: 24, android: 10}),
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
