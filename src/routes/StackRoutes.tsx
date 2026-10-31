import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TabRoutes } from './TabRoutes';
import { SwipeScreen } from '../screens/SwipeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      <Stack.Screen
        name="Swipe"
        component={SwipeScreen}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}
