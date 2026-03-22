import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FutebolScreen from '../../screens/FutebolScreen';

const Stack = createNativeStackNavigator();

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
    </Stack.Navigator>
  );
}
