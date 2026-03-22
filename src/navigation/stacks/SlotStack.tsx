import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SlotScreen from '../../screens/SlotScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

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
    </Stack.Navigator>
  );
}
