import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../../screens/ChatScreen';
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
        component={ChatScreen}
        options={{ title: 'Suporte' }}
      />
    </Stack.Navigator>
  );
}
