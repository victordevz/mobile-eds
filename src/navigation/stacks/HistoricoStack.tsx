import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoricoScreen from '../../screens/HistoricoScreen';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator();

export default function HistoricoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="HistoricoHome"
        component={HistoricoScreen}
        options={{ title: 'Histórico' }}
      />
    </Stack.Navigator>
  );
}
