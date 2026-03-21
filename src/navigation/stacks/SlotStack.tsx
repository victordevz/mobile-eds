import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SlotScreen from '../../screens/SlotScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

export default function SlotStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="SlotHome"
        component={SlotScreen}
        options={{ title: 'Slot' }}
      />
    </Stack.Navigator>
  );
}
