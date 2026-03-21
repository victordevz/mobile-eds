import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuporteScreen from '../../screens/SuporteScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

export default function SuporteStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="SuporteHome"
        component={SuporteScreen}
        options={{ title: 'Suporte' }}
      />
    </Stack.Navigator>
  );
}
