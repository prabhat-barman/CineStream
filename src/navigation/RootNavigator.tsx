import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthNavigator} from './AuthNavigator';
import {MainTabs} from './MainTabs';
import {MovieDetailsScreen} from '../screens/MovieDetailsScreen';
import {colors} from '../theme/colors';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MovieDetails: {id: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetailsScreen}
        options={{animation: 'slide_from_bottom'}}
      />
    </Stack.Navigator>
  );
}
