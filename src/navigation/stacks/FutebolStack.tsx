import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FutebolScreen from '../../screens/FutebolScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

export default function FutebolStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="FutebolHome"
        component={FutebolScreen}
        options={{ title: 'Futebol' }}
      />
    </Stack.Navigator>
  );
}
