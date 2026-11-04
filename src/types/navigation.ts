import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  MainTabs: undefined;
  Swipe: {
    folderId?: string;
    folderName?: string;
    initialPhotoIndex?: number;
  };
};

export type TabParamList = {
  Pastas: undefined;
  Tags: undefined;
  Buscar: undefined;
  Sobre: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type SwipeScreenRouteProp = RouteProp<RootStackParamList, 'Swipe'>;

export type TabNavProp = BottomTabNavigationProp<TabParamList>;

