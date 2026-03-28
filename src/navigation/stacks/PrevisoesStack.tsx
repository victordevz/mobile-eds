import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrevisoesScreen from '../../screens/PrevisoesScreen';

export type PrevisoesStackParamList = {
  PrevisoesHome: undefined;
};

const Stack = createNativeStackNavigator<PrevisoesStackParamList>();

export default function PrevisoesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrevisoesHome" component={PrevisoesScreen} />
    </Stack.Navigator>
  );
}
