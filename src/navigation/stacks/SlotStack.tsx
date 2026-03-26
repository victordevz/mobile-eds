import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SlotScreen from '../../screens/SlotScreen';
import GameScreen from '../../screens/GameScreen';
import { colors } from '../../theme';

export type SlotStackParamList = {
  SlotHome: undefined;
  Game: { gameUrl: string; title: string };
};

const Stack = createNativeStackNavigator<SlotStackParamList>();

export default function SlotStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SlotHome"
        component={SlotScreen}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
      />
    </Stack.Navigator>
  );
}
