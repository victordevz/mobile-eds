import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoletaScreen from '../../screens/RoletaScreen';

const Stack = createNativeStackNavigator();

export default function RoletaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoletaHome" component={RoletaScreen} />
    </Stack.Navigator>
  );
}
