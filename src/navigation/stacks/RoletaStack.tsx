import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoletaScreen from '../../screens/RoletaScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

export default function RoletaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="RoletaHome"
        component={RoletaScreen}
        options={{ title: 'Roleta' }}
      />
    </Stack.Navigator>
  );
}
