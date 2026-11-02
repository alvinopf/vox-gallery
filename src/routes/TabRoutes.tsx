import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import { FoldersScreen } from '../screens/FoldersScreen';
import { TagsScreen } from '../screens/TagsScreen';
import { FilterScreen } from '../screens/FilterScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#0F2942',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#1E6091',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon = '📁';
          if (route.name === 'Pastas') icon = '📁';
          if (route.name === 'Tags') icon = '🏷️';
          if (route.name === 'Buscar') icon = '🔍';
          if (route.name === 'Sobre') icon = 'ℹ️';

          return <Text style={{ fontSize: focused ? 20 : 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Pastas"
        component={FoldersScreen}
        options={{ title: 'Galeria' }}
      />
      <Tab.Screen
        name="Tags"
        component={TagsScreen}
        options={{ title: 'Tags' }}
      />
      <Tab.Screen
        name="Buscar"
        component={FilterScreen}
        options={{ title: 'Filtro' }}
      />
      <Tab.Screen
        name="Sobre"
        component={AboutScreen}
        options={{ title: 'Sobre' }}
      />
    </Tab.Navigator>
  );
}

