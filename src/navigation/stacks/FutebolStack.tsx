import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FutebolScreen from '../../screens/FutebolScreen';
import MatchDetailsScreen from '../../screens/MatchDetailsScreen';

export type FutebolStackParamList = {
  FutebolHome: undefined;
  MatchDetails: {
    matchId?: string;
    league?: string;
    homeTeam?: string;
    awayTeam?: string;
  };
};

const Stack = createNativeStackNavigator<FutebolStackParamList>();

export default function FutebolStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="FutebolHome"
        component={FutebolScreen}
      />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetailsScreen}
      />
    </Stack.Navigator>
  );
}
